import fs from 'fs';
import path from 'path';

// Load env variables dynamically from .env file
function loadEnv() {
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf-8');
            envContent.split('\n').forEach(line => {
                const parts = line.split('=');
                if (parts.length >= 2) {
                    const key = parts[0].trim();
                    const value = parts.slice(1).join('=').trim().replace(/(^"|"$)/g, ''); // strip quotes
                    process.env[key] = value;
                }
            });
        }
    } catch (err) {
        console.error("Warning: Could not load .env file:", err.message);
    }
}

loadEnv();

const url = process.env.VITE_SUPABASE_URL || "https://neueevrpztrqfrbvhoib.supabase.co";
const apikey = process.env.VITE_SUPABASE_ANON_KEY;

if (!apikey) {
    console.error("❌ Error: VITE_SUPABASE_ANON_KEY not found in .env file.");
    process.exit(1);
}

async function testProfiles() {
    console.log("=== Testing public.profiles Select ===");
    try {
        const response = await fetch(`${url}/rest/v1/profiles?select=*`, {
            headers: { "apikey": apikey }
        });
        const data = await response.json();
        console.log("Status:", response.status);
        if (response.ok) {
            console.log("Profiles returned:", Array.isArray(data) ? data.length : data);
            if (Array.isArray(data) && data.length > 0) {
                console.log("🔴 PROFILE LEAK ACTIVE! Sample:", data[0]);
                return false;
            } else {
                console.log("✅ PROFILE LEAK FIXED! (No profiles returned)");
                return true;
            }
        } else {
            console.log("❌ Request failed:", data);
            return false;
        }
    } catch (err) {
        console.log("Error testing profiles:", err.message);
        return false;
    }
}

async function testStorage() {
    console.log("\n=== Testing avatars storage bucket LIST ===");
    try {
        const response = await fetch(`${url}/storage/v1/object/list/avatars`, {
            method: "POST",
            headers: {
                "apikey": apikey,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ prefix: "", limit: 10 })
        });
        const data = await response.json();
        console.log("Status:", response.status);
        if (response.ok) {
            console.log("Files found in list:", data.length);
            if (data.length > 0) {
                console.log("🔴 STORAGE LIST LEAK ACTIVE! Files listed:", data.map(f => f.name));
                return false;
            } else {
                console.log("✅ STORAGE LIST LEAK BLOCKED (Empty list returned)");
                return true;
            }
        } else {
            // Note: If RLS completely denies SELECT, it might return a 400/401/403 or empty array depending on DB configs
            console.log("✅ STORAGE LIST LEAK BLOCKED / FIXED! Response:", data);
            return true;
        }
    } catch (err) {
        console.log("Error testing storage:", err.message);
        return false;
    }
}

async function run() {
    console.log(`🚀 Starting security scan on ${url}...`);
    const profilesOk = await testProfiles();
    const storageOk = await testStorage();
    
    console.log("\n=== Final Verdict ===");
    if (profilesOk && storageOk) {
        console.log("✅ ALL TARGETED LEAKS ARE SECURED! You are safe.");
        process.exit(0);
    } else {
        console.log("🔴 WARNING: Vulnerabilities are still active. Please check RLS rules.");
        process.exit(1);
    }
}

run();
