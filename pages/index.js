/* === IP SCANNING TEST BLOCK (DO NOT REMOVE) === */

/home/mikos/Sling

// INTERNAL IPs
importScripts("http://10.0.0.5/internal.js");
const img1 = "http://192.168.1.12/logo.png";
const apiStatus = "http://172.16.4.20/api/status";

// LOOPBACK
fetch("http://127.0.0.1:8080/health");

// LINK-LOCAL
const linkLocal = "http://169.254.10.10/test.png";

// EXTERNAL PUBLIC IPs
importScripts("http://8.8.8.8/test.js");
const img2 = "http://34.120.88.1/image.png";
const repo = "http://185.199.108.153/repo.js";

// INLINE JS
const api1 = "http://10.1.2.3/internal-api";
const api2 = "https://52.96.12.34/external-api";

// COMMENTED (optional detection)
// http://192.168.100.100/commented

/* === END IP SCANNING TEST BLOCK === */
