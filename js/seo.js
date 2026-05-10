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
            'og:title': `${config.company.name} | Partenaire Patrimonial`,
            'og:description': 'Sécurisation foncière et construction premium en Côte d\'Ivoire.',
            'og:image': 'https://milleniumci.netlify.app/assets/og-image.jpg',
            'og:url': 'https://milleniumci.netlify.app',
            'og:type': 'website',
            'twitter:card': 'summary_large_image',
            'twitter:title': `${config.company.name}`,
            'twitter:description': 'Expertise immobilière et construction haut de gamme à Abidjan.'
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
                    "@id": "https://milleniumci.netlify.app/#organization",
                    "name": config.company.name,
                    "url": "https://milleniumci.netlify.app/",
                    "logo": {
                        "@type": "ImageObject",
                        "url": "https://milleniumci.netlify.app/logo.png"
                    },
                    "description": "Expertise en sécurisation foncière et construction premium en Côte d'Ivoire. Partenaire de confiance pour la diaspora.",
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
                    "image": "https://milleniumci.netlify.app/logo.png",
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
                    "openingHours": "Mo-Fr 08:30-17:30"
                }
            ]
        };

        // Add Projects (Real Estate Products)
        if (config.products) {
            config.products.forEach(p => {
                schema["@graph"].push({
                    "@type": "RealEstateListing",
                    "name": p.name,
                    "description": p.description,
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": p.zone
                    },
                    "category": "Real Estate",
                    "additionalProperty": [
                        {
                            "@type": "PropertyValue",
                            "name": "Standing",
                            "value": p.standing
                        },
                        {
                            "@type": "PropertyValue",
                            "name": "Type",
                            "value": p.type
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
