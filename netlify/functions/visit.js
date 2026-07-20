const admin = require("firebase-admin");

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://dexomi-dev1-default-rtdb.firebaseio.com"
    });
}

const db = admin.database();

exports.handler = async (event) => {
    try {
        const ip =
            event.headers["x-nf-client-connection-ip"] ||
            event.headers["x-forwarded-for"]?.split(",")[0] ||
            "Unknown";

        const geo = await fetch(`https://ipwho.is/${ip}`);
        const info = await geo.json();

        const browser = event.headers["user-agent"] || "Unknown";

        const visit = {
            ip,
            country: info.country || "Unknown",
            city: info.city || "Unknown",
            region: info.region || "Unknown",
            timezone: info.timezone?.id || "Unknown",
            isp: info.connection?.isp || "Unknown",
            browser,
            language: event.headers["accept-language"] || "Unknown",
            createdAt: Date.now()
        };

        await db.ref("visits").push(visit);

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true
            })
        };

    } catch (e) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: e.message
            })
        };
    }
};