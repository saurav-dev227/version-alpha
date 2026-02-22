---
description: How to build and deploy the ASEM Frontend to a test or production server
---

# Deployment Workflow

To deploy the ASEM Frontend (Angular 16), follow these steps:

### 1. Build the Application
Run the production build command on your local machine or build server. This generates optimized artifacts in the `dist/` directory.

> [!NOTE]
> We use `--openssl-legacy-provider` to ensure compatibility with Node 20+ since the project uses some legacy cryptographic signatures.

```powershell
# turbo
npm run build
```

### 2. Locate Build Artifacts
The build files will be generated in:
`c:\Users\DELL\Downloads\01\avcms-frontend-main\dist\movie-rater-web`

### 3. Upload to Server
Transfer the contents of the `dist/movie-rater-web` folder to your web server (e.g., Nginx, Apache, or AWS S3).

### 4. Server Configuration (SPA Fallback)
Since Angular is a Single Page Application (SPA), the web server must be configured to redirect all requests to `index.html`. This allows the Angular router to handle the URL on the client side. Without this, deep-linking (e.g., refreshing on `/wh-metering`) will result in a 404 error.

#### **Nginx**
Add the `try_files` directive to your site configuration:
```nginx
server {
    listen 80;
    server_name your-site.com;
    root /var/www/html/movie-rater-web;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### **Apache**
Create or edit a `.htaccess` file in the root directory (the same level as `index.html`):
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

#### **IIS (web.config)**
If using Windows Server, add a rewrite rule to `web.config`:
```xml
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="AngularJS Routes" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/index.html" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

### 5. Verification
Once uploaded, visit the site URL and verify:
- The dashboard loads correctly.
- Navigation (Site Page, Breadcrumbs) works.
- **Deep-linking**: Navigate to a page, then refresh the browser. It should reload the same page, not a 404.
- Graphs render with the new loading spinners.

---

## Troubleshooting: 500 Internal Server Error / Permission Denied

If you see a "500 Internal Server Error" or "Permission Denied" in Nginx logs, run these exact commands on your server:

### 1. Fix Ownership and Permissions
The web server user (`www-data`) needs to own the files to serve them.

```bash
# Set ownership to the web user
sudo chown -R www-data:www-data /var/www/html/movie-rater-web

# Set directory permissions to 755 (Readable/Executable)
sudo find /var/www/html/movie-rater-web -type d -exec chmod 755 {} \;

# Set file permissions to 644 (Readable)
sudo find /var/www/html/movie-rater-web -type f -exec chmod 644 {} \;
```

### 2. Check the Path Exists
Ensure the root path in your Nginx config matches where you uploaded the files:
`root /var/www/html/movie-rater-web;`

### 3. Redirection Cycle Error
If you see "redirection cycle" in logs, it usually means Nginx is trying to find `index.html` but because the permissions are wrong, it fails and keeps redirecting back to `index.html`. Fixing the permissions above will resolve this.
