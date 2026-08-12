Paper thumbnails
================

Drop an image in this folder, then point the matching entry in
_data/papers.yml at it:

    image: "papers/vix-term-structure.png"
    image_alt: "Term structure of VIX futures across maturities, 2003-2025"

Notes
-----
* The path is relative to /images/, so "papers/foo.png" resolves to
  /images/papers/foo.png.
* Aim for roughly a 4:3 crop, at least 480x360. The card crops to 4:3 with
  object-fit: cover, so anything important should sit near the centre.
* A key figure from the paper works far better than a stock photo.
* image_alt is read aloud by screen readers and indexed by search engines.
  Describe what the figure shows, not that it is a figure.
* Leave `image:` blank and the card draws a numbered plate instead — the
  page still looks finished, so there is no rush to illustrate every paper.
