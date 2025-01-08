# wraven.org

Since GitHub Pages doesn’t process Tailwind automatically, you must build the CSS locally before pushing it to our GitHub

    Install Dependencies:

npm init -y
npm install tailwindcss@latest daisyui@latest

Generate Tailwind Config (if not done already):

npx tailwindcss init

Build CSS: Run this command to process the styles.css file with Tailwind:

npx tailwindcss -i ./css/styles.css -o ./css/output.css --watch

Replace ./css/styles.css with the actual path to your CSS file.

Update Your HTML to Use the Built CSS: Update the <head> of index.html to link to the generated output.css:

<link href="css/output.css" rel="stylesheet">

Commit and push the processed output.css along with other files to GitHub.
