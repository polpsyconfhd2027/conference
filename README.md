# Political Psychology Conference Website

Static conference website - ready for GitHub Pages hosting.

## Included pages

- `index.html` for the landing page
- `about.html` for conference information
- `registration.html` for registration details and the external registration link
- `program.html` for the editable conference program and PDF export
- `travel.html` for venue and travel information

## Important files & To dos

- Update registration link in `assets/site-config.js`
- Update the program schedule in `assets/program-data.js`
- Replace placeholder page text directly in the HTML files

## PDF export

Open `program.html` and click `Export Program As PDF`.
Your browser print dialog will open, and you can save the page as a PDF.

## GitHub Pages hosting for later

1. Create a GitHub repository and upload these files.
2. In the repository settings, open `Pages`.
3. Set the source to deploy from the main branch and root folder.
4. Your site will be published on a GitHub Pages URL.
5. Later, connect your custom domain in the same `Pages` settings area.

## Local preview

Preview locally with:

```bash
python3 -m http.server 8000
```
while being in the folder 

Open with `http://localhost:8000`.
