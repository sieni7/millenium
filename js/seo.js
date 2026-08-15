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
            'og:title': `${config.company.name} | Conseil en Transformation Digitale`,
            'og:description': 'Accompagnement numérique des coopératives agricoles en Côte d\'Ivoire. Création de sites web, formation et support local.',
            'og:image': 'https://milleniumci.netlify.app/assets/icons/icon-512.png',
            'og:url': 'https://milleniumci.netlify.app',
            'og:type': 'website',
            'twitter:card': 'summary_large_image',
            'twitter:title': `${config.company.name}`,
            'twitter:description': 'Accompagnement numérique des coopératives agricoles en Côte d\'Ivoire. Création de sites web, formation et support local.'
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
                    "@type": "ProfessionalService",
                    "@id": "https://milleniumci.netlify.app/#organization",
                    "name": config.company.name,
                    "url": "https://milleniumci.netlify.app/",
                    "description": config.company.mission,
                    "slogan": config.company.slogan,
                    "address": {
                        "@type": "PostalAddress",
                        "streetAddress": config.company.address,
                        "addressLocality": "Adzopé",
                        "addressCountry": "CI"
                    },
                    "contactPoint": {
                        "@type": "ContactPoint",
                        "telephone": config.company.phone,
                        "contactType": "customer service"
                    }
                }
            ]
        };

        // Add Services
        if (config.services) {
            config.services.forEach(s => {
                schema["@graph"].push({
                    "@type": "Service",
                    "name": s.title,
                    "description": s.description,
                    "provider": {
                        "@id": "https://milleniumci.netlify.app/#organization"
                    }
                });
            });
        }

        // Add Team Members
        if (config.team) {
            config.team.forEach(m => {
                schema["@graph"].push({
                    "@type": "Person",
                    "name": m.name,
                    "jobTitle": m.role,
                    "description": m.description,
                    "worksFor": {
                        "@id": "https://milleniumci.netlify.app/#organization"
                    }
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