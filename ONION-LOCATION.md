# WRAVEN.org Onion-Location Header Implementation

This repository includes multiple implementations of the Onion-Location header for Tor support.

## What is Onion-Location?

The Onion-Location header is a way to advertise the availability of your website via Tor. When a user visits your site through the regular web, Tor Browser will display a ".onion available" button that allows them to switch to the Tor version.

## Our Onion Address

```
http://fxyk2rjld5uqnkpqazbgt6w6yvq27vejjrg3brgtcdl3dm2bmq5c4nyd.onion
```

## Implementation Methods

### 1. Service Worker (Primary Method)
- **File**: `sw.js`
- **Status**: ✅ Active
- **Description**: Adds the Onion-Location header to all HTML responses via the service worker
- **Pros**: Works with any hosting provider, no server configuration needed
- **Cons**: Only works after the service worker is installed

### 2. Apache (.htaccess)
- **File**: `.htaccess`
- **Status**: ✅ Ready
- **Description**: Server-side header injection for Apache servers
- **Pros**: Works immediately, no JavaScript required
- **Cons**: Requires Apache server with mod_headers enabled

### 3. Netlify Headers
- **File**: `_headers`
- **Status**: ✅ Ready
- **Description**: Netlify-specific header configuration
- **Pros**: Works with Netlify deployments, no server config needed
- **Cons**: Netlify-specific

### 4. Nginx Configuration
- **File**: `nginx.conf`
- **Status**: ✅ Ready
- **Description**: Nginx server configuration snippet
- **Pros**: High performance, server-level implementation
- **Cons**: Requires Nginx server access

### 5. Client-side JavaScript
- **File**: `script.js`
- **Status**: ✅ Active
- **Description**: Adds meta tag and Tor Browser detection
- **Pros**: Works everywhere, includes user notifications
- **Cons**: Requires JavaScript enabled

## How to Deploy

### For GitHub Pages / Static Hosting
1. The Service Worker implementation is already active
2. The client-side JavaScript will handle header injection
3. No additional configuration needed

### For Apache Servers
1. Ensure the `.htaccess` file is uploaded to your web root
2. Verify `mod_headers` is enabled
3. Test with: `curl -I https://wraven.org`

### For Netlify
1. The `_headers` file is already configured
2. Deploy normally - headers will be automatically applied

### For Nginx
1. Add the configuration from `nginx.conf` to your server block
2. Reload Nginx: `sudo nginx -s reload`
3. Test with: `curl -I https://wraven.org`

## Testing

To test if the Onion-Location header is working:

```bash
# Check for the header
curl -I https://wraven.org

# Look for:
# Onion-Location: http://fxyk2rjld5uqnkpqazbgt6w6yvq27vejjrg3brgtcdl3dm2bmq5c4nyd.onion
```

## Browser Support

- **Tor Browser**: Full support - shows ".onion available" button
- **Firefox**: Partial support with privacy.resistFingerprinting enabled
- **Chrome/Safari**: No native support, but header is still added

## Security Considerations

1. **HTTPS Only**: Onion-Location headers should only be sent over HTTPS
2. **Path Preservation**: The header includes the current path and query parameters
3. **Subdomain Handling**: Only applies to wraven.org and www.wraven.org
4. **No Sensitive Data**: No sensitive information is exposed in the onion address

## Troubleshooting

### Header Not Appearing
1. Check if mod_headers is enabled (Apache)
2. Verify the service worker is installed (check DevTools > Application > Service Workers)
3. Clear browser cache and reload
4. Check browser developer console for errors

### Tor Browser Not Showing Button
1. Ensure you're accessing via HTTPS
2. Check that the onion address is valid and accessible
3. Verify the header format matches the specification

## Resources

- [Tor Project - Onion-Location](https://community.torproject.org/onion-services/advanced/onion-location/)
- [MDN - HTTP Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers)
- [RFC 7234 - HTTP Caching](https://tools.ietf.org/html/rfc7234)

## Support

For issues with the Onion-Location implementation, please contact: contact@wraven.org
