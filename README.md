# Political Psychology Conference Website

Static conference website - ready for GitHub Pages hosting.

## Included pages

- `index.html` for the landing page
- `about.html` for conference information
- `submission.html` for submission details and the external survey link
- `registration.html` for registration details and the external registration link
- `program.html` for the editable conference program and PDF export
- `travel.html` for venue and travel information

## Important files and updates
- Update general conf infos and text
- Update registration link in `assets/site-config.js`
- Update submission survey link in `assets/site-config.js`
- Update the program schedule in `assets/program-data.js`
- Change/Style website

## GitHub Pages hosting (after finalizing website)

1. In the repository settings, open `Pages`.
2. Set the source to deploy from the main branch and root folder.
3. Your site will be published on a GitHub Pages URL.
4. Later, connect your custom domain in the same `Pages` settings area.

## Until ready to publish: Local preview

Preview locally with:

```bash
python3 -m http.server 8000
```
while being in the folder 

Open with `http://localhost:8000`.

## PDF export of program

Open `program.html` and click `Export Program As PDF`.
Your browser print dialog will open, and you can save the page as a PDF.
