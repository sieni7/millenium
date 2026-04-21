/**
 * SEO Optimization Logic & JSON-LD Structure
 */

const SEO = {
    init(config) {
        this.injectJSONLD(config);
        this.injectOpenGraph(config);
    },

    injectOpenGraph(config) {
        const metaData = {
            'og:title': `${config.company.name} | Excellence Pharmaceutique`,
            'og:description': 'Représentation et promotion médicale de pointe en Côte d\'Ivoire.',
            'og:image': 'https://kirampharma.ci/assets/og-image.jpg',
            'og:url': 'https://kirampharma.ci',
            'og:type': 'website',
            'twitter:card': 'summary_large_image',
            'twitter:title': `${config.company.name}`,
            'twitter:description': 'Promotion médicale et commercialisation pharmaceutique à Abidjan.'
        };

        Object.keys(metaData).forEach(key => {
            let meta = document.querySelector(`meta[property="${key}"], meta[name="${key}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                if (key.startsWith('og:')) {
                    meta.setAttribute('property', key);
                } else {
                    meta.setAttribute('name', key);
                }
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', metaData[key]);
        });
        console.log('[SEO] Open Graph Tags Injected.');
    },

    injectJSONLD(config) {
        const schema = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "Organization",
                    "@id": "https://kirampharma.com/#organization",
                    "name": config.company.name,
                    "url": "https://kirampharma.com/",
                    "logo": {
                        "@type": "ImageObject",
                        "url": "https://kirampharma.com/logo.png"
                    },
                    "description": "Excellence Pharmaceutique en Côte d'Ivoire. Distribution et promotion médicale.",
                    "address": {
                        "@type": "PostalAddress",
                        "streetAddress": config.company.address,
                        "addressLocality": "Abidjan",
                        "addressCountry": "CI"
                    },
                    "contactPoint": {
                        "@type": "ContactPoint",
                        "telephone": config.contact.phone,
                        "contactType": "customer service"
                    }
                },
                {
                    "@type": "LocalBusiness",
                    "name": config.company.name,
                    "image": "https://kirampharma.com/logo.png",
                    "address": {
                        "@type": "PostalAddress",
                        "streetAddress": config.company.address,
                        "addressLocality": "Abidjan",
                        "addressCountry": "CI"
                    },
                    "geo": {
                        "@type": "GeoCoordinates",
                        "latitude": 5.3484,
                        "longitude": -4.0305
                    },
                    "openingHours": "Mo-Fr 08:00-18:00"
                }
            ]
        };

        // Add Products (N3-015)
        if (config.products) {
            config.products.forEach(p => {
                schema["@graph"].push({
                    "@type": "Product",
                    "name": p.name,
                    "description": p.indication,
                    "manufacturer": {
                        "@type": "Organization",
                        "name": p.laboratory
                    },
                    "category": "Pharmaceuticals",
                    "additionalProperty": [
                        {
                            "@type": "PropertyValue",
                            "name": "Principe Actif",
                            "value": p.active_ingredient
                        },
                        {
                            "@type": "PropertyValue",
                            "name": "Format",
                            "value": p.presentation
                        }
                    ]
                });
            });
        }

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(schema);
        document.head.appendChild(script);
        console.log('[SEO] JSON-LD Structure Injected.');
    }
};

export default SEO;
