# How to add to the library

You never need a terminal or any programming for this. Everything is done on github.com in your web browser. Each rabbi, each book and each derasha is one small text file. When you save a file, the website updates by itself within a minute or two.

## The three folders that matter

| Folder | What goes in it | One file per… |
|---|---|---|
| `_rabbis/` | Biographies | rabbi |
| `_books/` | Book title pages and introductions | book |
| `_derashos/` | The actual text | derasha (one sub-folder per book) |

Pictures go in `assets/images/rabbis/` and `assets/images/covers/`.

The `templates/` folder has a ready-made blank for each of the three. Copy one, fill it in, and save it.

## How the pieces connect

Every file has a short block of details at the top, between two lines of `---`. That block is how the website knows where each piece belongs:

- A **book** names its rabbi: `rabbi: julius-l-baker` (that's the rabbi's file name, without `.md`).
- A **derasha** names its book: `book: pri-yehudah` (the book's file name, without `.md`).
- A **derasha** can also say its `moed`, `parsha`, `occasion` and `subjects`.
- An **anthology** (one book, many rabbis, like *Moadim in America*) has `anthology: true` and no `rabbi:`. Each derasha in it names its own rabbi: `rabbi: reuven-maier`. The derasha then also appears on that rabbi's page.

The website then builds every way of browsing on its own:

- **By rabbi**: the bio page lists all of that rabbi's books.
- **By book**: the table of contents, in `order`, with a "read the whole book on one page" option.
- **By parsha**: every derasha on that parsha, from every rabbi.
- **By subject** and **by occasion**: a new subject appears the first time you use it.
- **Every derasha**: a full list, plus full-text search in English and Hebrew.

## Adding a derasha (the thing you'll do most)

1. On github.com, open the `_derashos` folder, then the folder for the book (for example `pri-yehudah`). If the book has no folder yet, see the tip below.
2. Click **Add file → Create new file**.
3. Name it with its number and a short title, for example `03-shabbos-hagadol.md`. Use lowercase letters and dashes, with no spaces.
4. Open `templates/derasha.md` in another tab, copy everything, and paste it in.
5. Fill in the details at the top, then paste the text of the derasha below the second `---`.
6. Click **Commit changes**.

**Tip:** To make a new folder, type the folder name followed by a slash in the file-name box (e.g. `pri-yehudah/01-introduction.md`). GitHub creates the folder for you.

## Adding a new rabbi or book

Same steps, in `_rabbis/` or `_books/`, using `templates/rabbi.md` or `templates/book.md`. The file name becomes the web address, so keep it simple: `shlomo-zlatalov.md`, `zichron-menachem.md`.

## Adding pictures

1. Open `assets/images/rabbis/` and click **Add file → Upload files**.
2. Drag in the photo, named after the rabbi (e.g. `isaac-leeser.jpg`), and commit.
3. In the rabbi's file, set `portrait: /assets/images/rabbis/isaac-leeser.jpg`.

Headstone photos, pictures of shuls and documents go under `gallery:`, each with a caption.

## Print editions and Amazon links

Every book's file (in `_books/`) has a **Print edition** section at the top:

```
in_print: true
amazon:            ← paste the Amazon link here
price: "$24.99"
format: Paperback
pages: 312
isbn: 978-...
blurb: One or two sentences for the Print Editions page.
```

- When the `amazon:` line is empty, the book shows **Coming soon to Amazon**.
- When you paste a link there, it shows a **Buy on Amazon** button, on the Print Editions page, on the book's page, and on each rabbi's page under "Available in print".
- `in_print: false` takes a book off the Print Editions page entirely.
- For a book cover, upload the image to `assets/images/covers/` and set `cover: /assets/images/covers/the-file-name.jpg`.

*Chazon Yeshayahu* and the *Book of Sermons* point to *Kisvei Rav Yeshayahu Glazer*, since they're printed as part of it. Put the Amazon link on the *Kisvei* file.

## Rabbis: the map, search and Yahrzeits This Week

Rabbis are imported from the "Rabbanim You Should Know data" Google Sheet; rows marked **Ready for AI** are the ones that go on the site. You can also edit a rabbi's file in `_rabbis/` directly — the blank form is `templates/rabbi.md`.

- `states:` (postal codes like `NY`, `IL`) puts a rabbi on the map and in the state filter.
- `yahrzeit_day:` and `yahrzeit_month:` make him appear in **Yahrzeits This Week** on the home page.
- Every section of a rabbi's page appears only when it has information, so leave anything unknown blank.

## The home page

The home page shows every rabbi with his portrait. To feature a rabbi large at the top, with the start of his biography, add `featured: true` to his file in `_rabbis/`. To add your logo, upload it to `assets/images/` and put its path on the `logo:` line in `_config.yml`.

## Spelling rules that matter

- **Parsha names** must match the list exactly: Bereishis, Noach, Lech Lecha, Vayeira, Chayei Sarah, Toldos, Vayeitzei, Vayishlach, Vayeishev, Mikeitz, Vayigash, Vayechi, Shemos, Va'eira, Bo, Beshalach, Yisro, Mishpatim, Terumah, Tetzaveh, Ki Sisa, Vayakhel, Pekudei, Vayikra, Tzav, Shemini, Tazria, Metzora, Acharei Mos, Kedoshim, Emor, Behar, Bechukosai, Bamidbar, Nasso, Beha'aloscha, Shelach, Korach, Chukas, Balak, Pinchas, Matos, Masei, Devarim, Va'eschanan, Eikev, Re'eh, Shoftim, Ki Seitzei, Ki Savo, Nitzavim, Vayeilech, Ha'azinu, V'zos HaBerachah. (The list lives in `_data/parshiyos.yml`.)
- **Moed names** must match the list in `_data/moadim.yml`: Elul, Rosh Hashana, Shabbos Shuva, Yom Kippur, Sukkos, Shemini Atzeres & Simchas Torah, Chanukah, Asarah B'Teves, Tu B'Shvat, Purim, Shabbos HaGadol, Pesach, Sefiras HaOmer, Shavuos, Shiva Asar B'Tammuz & the Three Weeks, Tisha B'Av.
- **Subjects and occasions** are free text, but stay consistent. "Shabbos" and "Shabbat" would show up as two different subjects.
- If a value contains a colon (`:`), put it in quotation marks: `title: "Shabbos: A Sign Forever"`.

## Formatting the text

- A blank line starts a new paragraph.
- `*italics*` → *italics* (use this for quotations from Tanach and Chazal)
- `**bold**` → **bold**
- `## A heading` → a section heading inside the derasha
- Footnotes: put `[^1]` where the marker goes, and at the bottom write `[^1]: Bereishis 1:1.`
- Hebrew paragraphs automatically line up right-to-left.

## If something looks wrong

Open the **Actions** tab on GitHub. A red ✗ means the last change had a problem, usually a missing `---` or a colon that needs quotation marks. Fix the file and commit again.

## In the Media
Podcast appearances, articles and videos are listed in `_data/media.yml` under `items:` (one entry each: type, title, outlet, date, url, and optionally summary and a YouTube video ID). The page lives at `/media/`; the "In the Media" menu link appears once the first entry is added.

## The editor (/admin)
`/admin/` on the live site is a form-based editor (Sveltia CMS). Sign in with a GitHub personal access token (fine-grained, this repository only, Contents: Read and write). Saving a form commits to `main`; the site rebuilds in about a minute. The forms are defined in `admin/config.yml`: when a new page field is added to the site, add it there too, or the editor will drop it when a page is saved.
