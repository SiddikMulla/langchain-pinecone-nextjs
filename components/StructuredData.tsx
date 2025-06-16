export default function StructuredData() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "DocuChat",
        "description": "AI-powered PDF document analysis and chat application",
        "url": "https://chat.siddik.site",
        "applicationCategory": "ProductivityApplication",
        "operatingSystem": "Web Browser",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "author": {
            "@type": "Person",
            "name": "Siddik Mulla"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Siddik",
            "url": "https://chat.siddik.site"
        },
        "featureList": [
            "PDF Upload",
            "AI-powered Chat",
            "Document Analysis",
            "Question Answering",
            "Text Extraction"
        ]
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    )
}