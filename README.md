# USFM GraphQL Tool
Check out the [playground](https://anonymouswalker.github.io/proskomma-usfm-graphql/) to execute the queries

### Summary
This repo is for experimental use. The `index.html` is exported from the React app as static webpage. There is no server communication/API calls needed to execute these queries. You can download (Save As .html) the website and use it locally.

### Gettings Started
First, we need to provide some data for the GraphQL model. Please upload a USFM file.

### Usage
Quick-bite query to get all text from all documents:
```
{
    documents {
       mainText
    }
}
```
#### 1. Get a book's content
We specify the `bookCode:"EPH"` to get the book of Ephesians (slug is EPH) which was imported beforehand.
Query:
```
{
  docSets {
    document(bookCode:"EPH") {
        slug: header(id:"bookCode")
        title: header(id:"toc")
        
        chapters: cIndexes {
          chapter
          text
        }
    }
  }
}
```
Result:
```
{
  "data": {
    "docSets": [
      {
        "document": {
          "slug": "EPH",
          "title": "The Letter of Paul to the Ephesians",
          "chapters": [
            {
              "chapter": 1,
              "text": "Paul, an apostle of Christ Jesus through the will of God,God's holy people in Ephesus, who are faithful in Christ Jesus.
              ...
```

#### 2. Get a chapter's content
Query:
```
{
  docSets {
    document(bookCode:"EPH") {
        slug: header(id:"bookCode")
        title: header(id:"toc")

        content: cvIndex(chapter:1) {
          chapter
          verses {
            verse {
              verseNumber: verseRange
              text
            }
          }
        }
    }
  }
}
```
Result:
```
{
  "data": {
    "docSets": [
      {
        "document": {
          "slug": "EPH",
          "title": "The Letter of Paul to the Ephesians",
          "content": {
            "chapter": 1,
            "verses": [
              {
                "verse": [
                  {
                    "verseNumber": "1",
                    "text": "Paul, an apostle of Christ Jesus through the will of God, to God's holy people in Ephesus, who are faithful in Christ Jesus."
                  }
                ]
              },
              ...
```
#### 3. Get a verse or multiple verses
Query:
```
{
  docSets {
    document(bookCode:"EPH") {
        v_1: cv(chapterVerses:"1:1") { text }
        v_2_3: cv(chapterVerses:"1:2-3") { text }
    }
  }
}
```
Result:
```
{
  "data": {
    "docSets": [
      {
        "document": {
          "v_1": [
            {
              "text": "Paul, an apostle of Christ Jesus through the will of God, to God's holy people in Ephesus, who are faithful in Christ Jesus."
            }
          ],
          "v_2_3": [
            {
              "text": "Grace to you and peace from God our Father and the Lord Jesus Christ."
            },
            {
              "text": "May the God and Father of our Lord Jesus Christ be praised, who has blessed us with every spiritual blessing in the heavenly places in Christ.\n"
            }
          ]
        }
      }
    ]
  }
}
```
#### More examples with all documents
Get all book headers:
```
{
  documents {
    header(id:"bookCode")
  }
}  
```
Get all documents' content with chapters & verses
```
{
  documents {
    header(id:"bookCode")
    cvIndexes {
      chapter
      verses {
        verse {verseRange text}
      }
    }
  }
}
```
### Sources & References
GraphQL schema references available [here](https://doc.proskomma.bible/en/latest/_static/schema/document.doc.html)
Built with [proskomma-js](https://github.com/mvahowe/proskomma-js)
