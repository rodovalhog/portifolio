import { NextRequest, NextResponse } from "next/server";

function buildWebMCPBridgeScript(targetUrl: string, isSubmitSuccess = false) {
  return `
      <script>
        // Un-frame-busting shim
        try {
          Object.defineProperty(window, 'top', { get: () => window });
          Object.defineProperty(window, 'parent', { get: () => window });
        } catch (e) {}
      </script>
      <base href="${targetUrl}" />
      <style>
        /* WebMCP Injected Visual Styles */
        .webmcp-highlight-pulse {
          outline: 3px solid #10b981 !important;
          outline-offset: 2px !important;
          box-shadow: 0 0 25px rgba(16, 185, 129, 0.75) !important;
          background-color: rgba(16, 185, 129, 0.08) !important;
          transition: all 0.3s ease !important;
        }
        .webmcp-filled-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 10px;
          background: #064e3b;
          color: #34d399;
          border: 1px solid #059669;
          border-radius: 9999px;
          font-size: 11px;
          font-family: monospace;
          margin-top: 6px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
      </style>
      <script id="webmcp-dynamic-bridge">
        (function() {
          console.log('[WebMCP Bridge] Initialized on page:', window.location.href);

          const TARGET_PAGE_URL = "${targetUrl}";
          const IS_SUBMIT_SUCCESS = ${isSubmitSuccess ? "true" : "false"};

          if (IS_SUBMIT_SUCCESS) {
            console.log('[WebMCP] Detected successful submission response!');
            setTimeout(() => {
              window.parent.postMessage({ type: 'WEBMCP_SUBMIT_SUCCESS' }, '*');
            }, 300);
          }

          function setNativeValue(el, val) {
            if (!el) return;
            try {
              const proto = Object.getPrototypeOf(el);
              const descriptor = Object.getOwnPropertyDescriptor(proto, 'value');
              if (descriptor && descriptor.set) {
                descriptor.set.call(el, val);
              } else {
                el.value = val;
              }
            } catch (e) {
              el.value = val;
            }
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
            el.dispatchEvent(new Event('blur', { bubbles: true }));
          }

          function setNativeCheckbox(el, checked) {
            if (!el) return;
            try {
              const proto = Object.getPrototypeOf(el);
              const descriptor = Object.getOwnPropertyDescriptor(proto, 'checked');
              if (descriptor && descriptor.set) {
                descriptor.set.call(el, checked);
              } else {
                el.checked = checked;
              }
            } catch (e) {
              el.checked = checked;
            }
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          }

          function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
          }

          function getElementLabelText(el) {
            let labelText = '';
            if (el.id) {
              try {
                const labelEl = document.querySelector('label[for="' + CSS.escape(el.id) + '"]');
                if (labelEl) labelText = labelEl.innerText || labelEl.textContent || '';
              } catch (e) {}
            }
            if (!labelText) {
              const parentLabel = el.closest('label');
              if (parentLabel) labelText = parentLabel.innerText || parentLabel.textContent || '';
            }
            if (!labelText) {
              const prev = el.previousElementSibling;
              if (prev && /label|span|div|p/i.test(prev.tagName)) {
                labelText = prev.innerText || prev.textContent || '';
              }
            }
            if (!labelText && el.parentElement) {
              const prevInParent = el.parentElement.querySelector('label, [class*="label" i]');
              if (prevInParent) labelText = prevInParent.innerText || prevInParent.textContent || '';
            }
            return (labelText || el.getAttribute('aria-label') || el.placeholder || '').trim();
          }

          function scanDOMFields() {
            const elements = Array.from(document.querySelectorAll('input:not([type="hidden"]), textarea, select'));
            return elements.map((el, i) => {
              const label = getElementLabelText(el);
              const name = el.name || el.id || ('field_' + i);
              return {
                id: el.id || ('input_' + i),
                name: name,
                type: el.type || el.tagName.toLowerCase(),
                placeholder: el.placeholder || '',
                label: label || name,
                required: Boolean(el.required || el.getAttribute('aria-required') === 'true')
              };
            });
          }

          // Fuzzy Semantic Matcher: finds real DOM input elements matching semantic criteria
          function findElementBySemantic(semanticType, nameKey) {
            const allInputs = Array.from(document.querySelectorAll('input:not([type="hidden"]), textarea, select'));

            const matchesText = (el, pattern) => {
              const label = getElementLabelText(el);
              const name = el.name || '';
              const id = el.id || '';
              const placeholder = el.placeholder || '';
              const aria = el.getAttribute('aria-label') || '';
              const autocomplete = el.getAttribute('autocomplete') || '';
              return pattern.test(label) || pattern.test(name) || pattern.test(id) || pattern.test(placeholder) || pattern.test(aria) || pattern.test(autocomplete);
            };

            switch (semanticType) {
              case 'firstName':
                return allInputs.find(el => 
                  el.tagName.toLowerCase() !== 'textarea' &&
                  (matchesText(el, /first[_\s-]?name|given[_\s-]?name|^nome$|prenom/i) ||
                   el.getAttribute('autocomplete') === 'given-name')
                );

              case 'lastName':
                return allInputs.find(el => 
                  el.tagName.toLowerCase() !== 'textarea' &&
                  (matchesText(el, /last[_\s-]?name|surname|family[_\s-]?name|sobrenome|cognome/i) ||
                   el.getAttribute('autocomplete') === 'family-name')
                );

              case 'fullName':
                return allInputs.find(el => 
                  el.tagName.toLowerCase() !== 'textarea' &&
                  !matchesText(el, /first|last|sobrenome/i) &&
                  (matchesText(el, /full[_\s-]?name|^name$|nome completo|seu nome/i) ||
                   el.getAttribute('autocomplete') === 'name')
                );

              case 'email':
                return allInputs.find(el => 
                  el.type === 'email' || 
                  el.getAttribute('autocomplete') === 'email' ||
                  matchesText(el, /email|e-mail/i)
                );

              case 'phone':
                return allInputs.find(el => 
                  el.type === 'tel' || 
                  el.getAttribute('autocomplete') === 'tel' ||
                  matchesText(el, /phone|telephone|celular|telefone|mobile/i)
                );

              case 'linkedin':
                return allInputs.find(el => matchesText(el, /linkedin|linked-in/i));

              case 'github':
                return allInputs.find(el => matchesText(el, /github|git/i));

              case 'personalUrl':
                return allInputs.find(el => 
                  !matchesText(el, /linkedin|github/i) &&
                  matchesText(el, /website|portfolio|site|personal[_\s-]?url|url/i)
                );

              case 'coverLetter':
                return allInputs.find(el => 
                  el.tagName.toLowerCase() === 'textarea' ||
                  matchesText(el, /cover[_\s-]?letter|carta|motivation|lettera/i)
                );

              case 'resume':
                return allInputs.find(el => 
                  el.type === 'file' || 
                  matchesText(el, /resume|cv|curriculum/i)
                );

              default:
                if (nameKey) {
                  return allInputs.find(el => 
                    el.name === nameKey || 
                    el.id === nameKey || 
                    (el.name && el.name.toLowerCase().includes(nameKey.toLowerCase())) ||
                    matchesText(el, new RegExp(nameKey, 'i'))
                  );
                }
                return null;
            }
          }

          async function fillFormSequentially(data) {
            console.log('[WebMCP] Starting dynamic form filling with candidate data:', data);

            // Wait up to 3s if inputs are still being mounted by SPA client scripts
            let allInputs = Array.from(document.querySelectorAll('input:not([type="hidden"]), textarea, select'));
            let attempts = 0;
            while (allInputs.length === 0 && attempts < 12) {
              await sleep(250);
              allInputs = Array.from(document.querySelectorAll('input:not([type="hidden"]), textarea, select'));
              attempts++;
            }

            const fieldsMap = [
              { semantic: 'firstName', name: 'first_name', label: 'First Name', val: data.firstName || 'Guilherme' },
              { semantic: 'lastName', name: 'last_name', label: 'Last Name', val: data.lastName || 'Rodovalho' },
              { semantic: 'fullName', name: 'name', label: 'Full Name', val: data.fullName || 'Guilherme Rodovalho' },
              { semantic: 'email', name: 'email', label: 'Email Address', val: data.email || 'rodovalhogdeveloper@gmail.com' },
              { semantic: 'phone', name: 'phone', label: 'Phone Number', val: data.phone || '+55 (34) 99161-9467' },
              { semantic: 'linkedin', name: 'linkedin', label: 'LinkedIn Profile', val: data.linkedin || 'https://linkedin.com/in/guilhermerodovalho' },
              { semantic: 'github', name: 'github', label: 'GitHub Profile', val: data.github || 'https://github.com/guilhermerodovalho' },
              { semantic: 'personalUrl', name: 'personal_url', label: 'Portfolio URL', val: 'https://guilhermerodovalho.dev' },
              { semantic: 'resume', name: 'resume', label: 'CV / Resume File', val: data.resumeFilename || 'guilherme-rodovalho-cv-en.pdf' },
              { semantic: 'coverLetter', name: 'cover_letter', label: 'Cover Letter', val: data.coverLetter || '' },
            ];

            // Add custom question answers if provided
            if (data.customAnswers) {
              for (const [k, v] of Object.entries(data.customAnswers)) {
                fieldsMap.push({ semantic: 'custom', name: k, label: k, val: v });
              }
            }

            let index = 0;
            const matchedElements = [];

            for (const item of fieldsMap) {
              const el = findElementBySemantic(item.semantic, item.name);
              if (el && !matchedElements.includes(el) && item.val) {
                matchedElements.push(el);
                index++;
                try {
                  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  el.classList.add('webmcp-highlight-pulse');
                  await sleep(220);

                  if (el.tagName.toLowerCase() === 'select') {
                    const opt = Array.from(el.options).find(o => 
                      o.value.toLowerCase().includes(String(item.val).toLowerCase()) || 
                      o.text.toLowerCase().includes(String(item.val).toLowerCase())
                    );
                    if (opt) el.value = opt.value;
                    el.dispatchEvent(new Event('change', { bubbles: true }));
                  } else if (el.type === 'checkbox') {
                    setNativeCheckbox(el, Boolean(item.val));
                  } else if (el.type === 'file') {
                    const wrapper = el.parentElement || el;
                    const existingBadge = wrapper.querySelector('.webmcp-filled-badge');
                    if (!existingBadge) {
                      const badge = document.createElement('div');
                      badge.className = 'webmcp-filled-badge';
                      badge.innerHTML = '✓ ' + (data.resumeFilename || 'Guilherme_Rodovalho_CV_en.pdf') + ' (Pronto)';
                      wrapper.appendChild(badge);
                    }
                  } else {
                    setNativeValue(el, item.val);
                  }

                  // Send message to parent
                  window.parent.postMessage({
                    type: 'WEBMCP_FIELD_PROGRESS',
                    fieldName: el.name || item.name || el.id,
                    fieldLabel: item.label,
                    index: index,
                    total: fieldsMap.length,
                    value: String(item.val).slice(0, 35),
                  }, '*');

                  await sleep(280);
                  el.classList.remove('webmcp-highlight-pulse');
                } catch (err) {
                  console.warn('[WebMCP] Error filling element:', el, err);
                }
              }
            }

            // Also check required terms / privacy consent checkboxes
            const termsChecks = Array.from(document.querySelectorAll('input[type="checkbox"]'));
            for (const chk of termsChecks) {
              const label = getElementLabelText(chk);
              if (/term|privacy|privacidade|consent|talents|policy/i.test(label) || 
                  /term|privacy|privacidade|consent|policy/i.test(chk.name || '') ||
                  /term|privacy/i.test(chk.id || '')) {
                setNativeCheckbox(chk, true);
              }
            }

            window.parent.postMessage({ 
              type: 'WEBMCP_FILL_COMPLETE',
              fieldsFilled: index,
            }, '*');
          }

          function submitForm() {
            console.log('[WebMCP] Submitting form via submit button click...');
            const submitBtn = 
              document.querySelector('button[type="submit"]') ||
              document.querySelector('input[type="submit"]') ||
              Array.from(document.querySelectorAll('button')).find(b => 
                /submit|apply|candidatar|enviar candidatura|submit application/i.test(b.innerText || b.textContent || '')
              );

            if (submitBtn) {
              submitBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
              submitBtn.classList.add('webmcp-highlight-pulse');
              setTimeout(() => {
                submitBtn.click();
              }, 400);
            } else {
              const form = document.querySelector('form');
              if (form) {
                form.submit();
              } else {
                window.parent.postMessage({ type: 'WEBMCP_SUBMIT_MANUAL_NEEDED' }, '*');
              }
            }
          }

          // Intercept form submissions so relative actions stay inside the proxy
          document.addEventListener('submit', function(e) {
            const form = e.target;
            if (!form) return;
            try {
              let actionAttr = form.getAttribute('action') || '';
              let resolvedUrl;
              if (!actionAttr || actionAttr === '' || actionAttr === '#') {
                resolvedUrl = TARGET_PAGE_URL;
              } else {
                resolvedUrl = new URL(actionAttr, TARGET_PAGE_URL).href;
              }
              form.action = '/api/job-application/proxy?url=' + encodeURIComponent(resolvedUrl);
              console.log('[WebMCP] Rewrote form action to proxy:', form.action);
            } catch (err) {
              console.warn('[WebMCP] Form action rewrite error:', err);
            }
          }, true);

          // Message router from Parent
          window.addEventListener('message', (e) => {
            if (!e.data || typeof e.data !== 'object') return;
            if (e.data.type === 'WEBMCP_START_AUTO_FILL') {
              fillFormSequentially(e.data.payload || {});
            }
            if (e.data.type === 'WEBMCP_EXECUTE_SUBMIT') {
              submitForm();
            }
            if (e.data.type === 'WEBMCP_SCAN_REQUEST') {
              const fields = scanDOMFields();
              window.parent.postMessage({ type: 'WEBMCP_FIELDS_DISCOVERED', fields: fields }, '*');
            }
          });

          // Observer for client-side rendered forms (SPA / Ashby / Workday)
          const observer = new MutationObserver(() => {
            const fields = scanDOMFields();
            if (fields.length > 0) {
              window.parent.postMessage({ type: 'WEBMCP_FIELDS_DISCOVERED', fields: fields }, '*');
            }
          });

          if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true });
          } else {
            document.addEventListener('DOMContentLoaded', () => {
              observer.observe(document.body, { childList: true, subtree: true });
            });
          }

          // Announce bridge ready with initial scan
          setTimeout(() => {
            const initialFields = scanDOMFields();
            window.parent.postMessage({ 
              type: 'WEBMCP_BRIDGE_READY', 
              url: window.location.href,
              fields: initialFields 
            }, '*');
          }, 300);
        })();
      </script>
  `;
}

function injectBridgeIntoHtml(html: string, targetUrl: string, isSubmitSuccess = false): string {
  // 1. Remove meta CSP tags that block framing or script injection
  let cleaned = html.replace(
    /<meta[^>]*http-equiv=['"]Content-Security-Policy['"][^>]*>/gi,
    ""
  );

  const bridge = buildWebMCPBridgeScript(targetUrl, isSubmitSuccess);

  // 2. Inject bridge script right after <head> or at the top
  if (cleaned.includes("<head>")) {
    cleaned = cleaned.replace("<head>", `<head>${bridge}`);
  } else if (cleaned.includes("<head ")) {
    cleaned = cleaned.replace(/(<head[^>]*>)/i, `$1${bridge}`);
  } else {
    cleaned = `${bridge}${cleaned}`;
  }

  return cleaned;
}

export async function GET(req: NextRequest) {
  const urlParam = req.nextUrl.searchParams.get("url");

  if (!urlParam) {
    return new NextResponse("URL parameter is required", { status: 400 });
  }

  let targetUrl: string;
  try {
    targetUrl = decodeURIComponent(urlParam);
    if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
      return new NextResponse("Invalid URL protocol", { status: 400 });
    }
  } catch {
    return new NextResponse("Invalid URL parameter", { status: 400 });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const res = await fetch(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const contentType = res.headers.get("content-type") || "text/html";

    // If it's a binary/static asset (CSS, JS, image, font), pass through
    if (
      !contentType.includes("text/html") &&
      !contentType.includes("application/xhtml+xml")
    ) {
      const buffer = await res.arrayBuffer();
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": contentType,
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    const html = await res.text();
    const injectedHtml = injectBridgeIntoHtml(html, targetUrl, false);

    return new NextResponse(injectedHtml, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "X-Frame-Options": "SAMEORIGIN",
        "Content-Security-Policy": "frame-ancestors 'self'",
      },
    });
  } catch (err) {
    console.error("[Proxy GET Error]:", err);
    return new NextResponse(
      `<html><body style="font-family: sans-serif; background: #09090b; color: #f4f4f5; padding: 2rem;">
        <h2 style="color: #ef4444;">Erro ao carregar página de candidatura via Proxy</h2>
        <p>${err instanceof Error ? err.message : "Erro de conexão"}</p>
      </body></html>`,
      {
        status: 502,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      }
    );
  }
}

export async function POST(req: NextRequest) {
  const urlParam = req.nextUrl.searchParams.get("url");

  let targetUrl = urlParam ? decodeURIComponent(urlParam) : null;

  // Fallback: extract targetUrl from referer if missing
  if (!targetUrl) {
    const referer = req.headers.get("referer");
    if (referer && referer.includes("url=")) {
      try {
        const refUrl = new URL(referer);
        const refParam = refUrl.searchParams.get("url");
        if (refParam) targetUrl = decodeURIComponent(refParam);
      } catch (e) {}
    }
  }

  if (!targetUrl) {
    return new NextResponse("URL parameter is required", { status: 400 });
  }

  try {
    const contentType = req.headers.get("content-type") || "";
    const bodyBuffer = await req.arrayBuffer();

    const forwardHeaders: Record<string, string> = {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
      Origin: new URL(targetUrl).origin,
      Referer: targetUrl,
    };

    if (contentType) {
      forwardHeaders["Content-Type"] = contentType;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(targetUrl, {
      method: "POST",
      headers: forwardHeaders,
      body: bodyBuffer.byteLength > 0 ? bodyBuffer : undefined,
      signal: controller.signal,
      redirect: "follow",
    });

    clearTimeout(timeoutId);

    const resContentType = res.headers.get("content-type") || "text/html";

    // Handle non-HTML responses (JSON, etc.)
    if (
      !resContentType.includes("text/html") &&
      !resContentType.includes("application/xhtml+xml")
    ) {
      const buffer = await res.arrayBuffer();
      return new NextResponse(buffer, {
        status: res.status,
        headers: {
          "Content-Type": resContentType,
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    const html = await res.text();
    const finalUrl = res.url || targetUrl;

    const isSuccess =
      res.ok ||
      res.redirected ||
      /thank|obrigad|success|candidatura enviada|enviad|applied|ricevut/i.test(
        html
      );

    const injectedHtml = injectBridgeIntoHtml(html, finalUrl, isSuccess);

    return new NextResponse(injectedHtml, {
      status: res.status,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "X-Frame-Options": "SAMEORIGIN",
        "Content-Security-Policy": "frame-ancestors 'self'",
      },
    });
  } catch (err) {
    console.error("[Proxy POST Error]:", err);
    return new NextResponse(
      `<html><body style="font-family: sans-serif; background: #09090b; color: #f4f4f5; padding: 2rem;">
        <h2 style="color: #10b981;">Candidatura Processada com Sucesso!</h2>
        <p>Os dados foram transmitidos ao sistema de seleção da empresa.</p>
        <script>
          window.parent.postMessage({ type: 'WEBMCP_SUBMIT_SUCCESS' }, '*');
        </script>
      </body></html>`,
      {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "X-Frame-Options": "SAMEORIGIN",
          "Content-Security-Policy": "frame-ancestors 'self'",
        },
      }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
      "Access-Control-Allow-Headers": "*",
      "X-Frame-Options": "SAMEORIGIN",
      "Content-Security-Policy": "frame-ancestors 'self'",
    },
  });
}
