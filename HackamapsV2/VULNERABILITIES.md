# Vulnerability Report: HackamapsV2

## 1. Stored XSS in MapView Component

**Severity:** Critical
**File:** `src/components/Map/MapView.tsx`

### Description
The `MapView` component is vulnerable to Stored Cross-Site Scripting (XSS). User-controlled data, specifically event `title`, `location`, and `logoUrl`, is directly interpolated into HTML strings used for Leaflet markers and popups without sanitization.

In `src/components/Map/MapView.tsx`:

```javascript
// ...
const iconHtml = ev.logoUrl
    ? `<div style="
            width: 100%; height: 100%;
            background-image: url('${ev.logoUrl}');
            // ...
       "></div>`
    : // ...

// ...
L.marker([lat, lng], { icon: customIcon })
    .bindPopup(`
    <div style="font-family: 'JetBrains Mono'; font-size: 12px; min-width: 150px;">
      <strong style="font-size: 14px; display: block; margin-bottom: 4px;">${ev.title || 'Untitled'}</strong>
      <span style="color: #A3A3A3;">${ev.location || 'Unknown Location'}</span>
    </div>
`)
```

- **`ev.title` and `ev.location`**: If these fields contain malicious scripts (e.g., `<script>alert('XSS')</script>`), they will be executed when the popup is opened.
- **`ev.logoUrl`**: If this field contains malicious content (e.g., `'); background-image: url('javascript:...');`), it could potentially lead to XSS or styling injection.

### Remediation

#### Fix for Popup (XSS)
Instead of passing an HTML string to `bindPopup`, use DOM elements. This allows setting `textContent`, which automatically escapes special characters.

**Proposed Code:**
```javascript
const popupContent = document.createElement('div');
popupContent.style.fontFamily = "'JetBrains Mono'";
popupContent.style.fontSize = "12px";
popupContent.style.minWidth = "150px";

const titleEl = document.createElement('strong');
titleEl.style.fontSize = "14px";
titleEl.style.display = "block";
titleEl.style.marginBottom = "4px";
titleEl.textContent = ev.title || 'Untitled';

const locEl = document.createElement('span');
locEl.style.color = "#A3A3A3";
locEl.textContent = ev.location || 'Unknown Location';

popupContent.appendChild(titleEl);
popupContent.appendChild(locEl);

L.marker([lat, lng], { icon: customIcon })
    .bindPopup(popupContent)
    .addTo(markerLayerRef.current);
```

#### Fix for Icon (`logoUrl`)
Since `L.divIcon` requires an HTML string (or at least works best with it in this context), strict validation of the URL is required. Ensure `logoUrl` starts with `http://` or `https://` and does not contain characters that could break the CSS string (like `'`).

Alternatively, use `encodeURI` or similar sanitization, but URL validation is safer.

```javascript
const safeLogoUrl = (url: string) => {
    try {
        const parsed = new URL(url);
        return (parsed.protocol === 'http:' || parsed.protocol === 'https:') ? url : '';
    } catch {
        return '';
    }
};
// Use safeLogoUrl(ev.logoUrl)
```
