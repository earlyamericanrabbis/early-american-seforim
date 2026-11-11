# Early American Seforim

A library of the derashos and seforim of early American rabbis, restored and re-published by Shimon Shlomo Springer as part of the **Early American Rabbis** project.

**Read it online: https://earlyamericanrabbis.github.io/early-american-seforim/**

Every derasha can be found five ways:

- **By rabbi**: each rabbi has a biography with portrait, dates, positions, burial place, pictures and sources.
- **By book**: read a sefer in order, one derasha at a time or the whole book on one page.
- **By parsha**: all 54 parshiyos, with every derasha on each from every rabbi.
- **By subject** and **by occasion**: Yomim Tovim, bar mitzvahs, hespedim and more.
- **By derasha**: the full list, with full-text search in English and Hebrew.

## The library so far

| Rabbi | Seforim |
|---|---|
| Rev. Isaac Leeser | *Discourses on the Jewish Religion*, Vol. II; *Discourses, Argumentative and Devotional*, Vol. III |
| Rabbi Simon (Yeshayahu) Glazer | *The Bar Mitzvah Pulpit*; *Chazon Yeshayahu*; *Book of Sermons for All Occasions* |
| Rabbi I. David Essrig | *The Fountain of Wisdom* (1932) |
| Rabbi Mordecai Mayer | *Israel's Wisdom in Modern Life* (1949) |
| Rabbi Julius L. Baker | *Pri Yehudah* (1967) |
| Rabbi Tzvi Avraham Henry | *Discourses on the Book of Genesis* |
| Rabbi Shlomo Zlatalov | *Sefer Zichron Menachem* |

## Adding to the library

See **[HOW-TO-ADD-CONTENT.md](HOW-TO-ADD-CONTENT.md)**. Everything can be done on github.com in a web browser.

## How the repository is laid out

```
_rabbis/       one file per rabbi (biography)
_books/        one file per book (title page and introduction)
_derashos/     one folder per book, one file per derasha
_data/         the list of parshiyos
_layouts/      page designs (rarely need changing)
_includes/     small reusable page pieces
assets/        pictures, covers, and the site's look (css)
templates/     blank forms to copy for a new rabbi, book or derasha
```

## The website

The site is published by GitHub Pages from the **main** branch (Settings → Pages). Every change you commit appears on the site within a minute or two.

If the repository is ever renamed, change the `baseurl` line in `_config.yml` to match.
