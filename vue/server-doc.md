# Server.js Funkcionális Dokumentáció

## 1. Függőségek és inicializálás

### Használt modulok
```javascript
import jsonServer from 'json-server'    // REST API szerver
import jwt from 'jsonwebtoken'          // JWT token kezelés
import bcrypt from 'bcryptjs'          // Jelszó titkosítás
```

### Szerver konfiguráció
```javascript
const server = jsonServer.create()                  // Szerver létrehozása
const router = jsonServer.router('db.json')         // Adatbázis router
const middlewares = jsonServer.defaults()           // Alapértelmezett middleware-ek
const SECRET_KEY = 'your-secret-key'                // JWT titkos kulcs
const expiresIn = '1h'                             // Token lejárati idő
```

## 2. Middleware-ek

### Alapértelmezett middleware-ek
```javascript
server.use(middlewares)               // Static fájlok, naplózás, CORS
server.use(jsonServer.bodyParser)     // Request body parse-olás
```

## 3. Segédfüggvények

### Token létrehozása
```javascript
const createToken = (payload) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn })
}
```
**Funkció:** JWT token generálása a felhasználói adatokból
- **Input:** payload (felhasználói adatok)
- **Output:** aláírt JWT token
- **Lejárat:** 1 óra

### Token ellenőrzés
```javascript
const verifyToken = (token) => {
  return jwt.verify(token, SECRET_KEY)
}
```
**Funkció:** JWT token érvényességének ellenőrzése
- **Input:** token string
- **Output:** dekódolt payload vagy hiba
- **Hibakezelés:** érvénytelen/lejárt token esetén hibát dob

## 4. Végpontok

### 1. Regisztráció `/register`
```javascript
server.post('/register', (req, res) => {
  const {name, email, password} = req.body
  // ...
})
```
**Funkciók:**
1. Email cím egyediségének ellenőrzése
2. Jelszó titkosítása bcrypt használatával
3. Felhasználó mentése az adatbázisba
4. JWT token generálása és visszaküldése

**Válaszok:**
- Siker: `200 OK` + token és felhasználói adatok
- Hiba: `400 Bad Request` ha az email már létezik

### 2. Bejelentkezés `/login`
```javascript
server.post('/login', (req, res) => {
  const {email, password} = req.body
  // ...
})
```
**Funkciók:**
1. Felhasználó keresése email alapján
2. Jelszó ellenőrzése bcrypt compare-ral
3. JWT token generálása sikeres bejelentkezéskor

**Válaszok:**
- Siker: `200 OK` + token és felhasználói adatok
- Hiba: 
  - `400 Bad Request` ha a felhasználó nem található
  - `400 Bad Request` ha a jelszó hibás

### 3. Védett végpontok
```javascript
server.use(/^(?!\/auth).*$/, (req, res, next) => {
  // Token ellenőrzése
})
```
**Funkciók:**
1. Authorization header ellenőrzése
2. Bearer token kinyerése
3. Token érvényességének ellenőrzése
4. Védett erőforrások elérésének biztosítása

**Válaszok:**
- Siker: `next()` - kérés továbbítása
- Hiba: 
  - `401 Unauthorized` hiányzó token esetén
  - `401 Unauthorized` érvénytelen token esetén

## 5. Adatbázis kezelés

### JSON Server router
```javascript
server.use(router)
```
**Funkciók:**
1. CRUD műveletek automatikus kezelése
2. RESTful végpontok biztosítása
3. db.json fájl kezelése adatbázisként

### Adatbázis struktúra (db.json)
```json
{
  "users": [
    {
      "id": 1,
      "name": "Példa Felhasználó",
      "email": "pelda@email.com",
      "password": "$2a$08$..." // hashelt jelszó
    }
  ]
}
```

## 6. Biztonsági funkciók

### Jelszó titkosítás
```javascript
const hashedPassword = bcrypt.hashSync(password, 8)
```
**Jellemzők:**
- Salt rounds: 8
- Automatikus salt generálás
- Biztonságos hash algoritmus

### Token biztonság
- 1 órás lejárati idő
- Titkos kulcs használata
- Bearer token formátum

## 7. Hibakezelés

### Típusok és válaszok
1. **Regisztrációs hibák:**
   - Létező email → 400
   - Hiányzó adatok → 400

2. **Bejelentkezési hibák:**
   - Hibás jelszó → 400
   - Nem létező felhasználó → 400

3. **Autentikációs hibák:**
   - Hiányzó token → 401
   - Érvénytelen token → 401
   - Lejárt token → 401

## 8. Szerver indítás
```javascript
server.listen(3000, () => {
  console.log('JSON Server is running on port 3000')
})
```
**Konfiguráció:**
- Port: 3000
- JSON Server middleware-ek
- Automatikus route kezelés
- CORS engedélyezése

## 9. Használati példák

### Regisztráció
```bash
POST http://localhost:3000/register
Content-Type: application/json

{
  "name": "Teszt User",
  "email": "teszt@email.com",
  "password": "jelszo123"
}
```

### Bejelentkezés
```bash
POST http://localhost:3000/login
Content-Type: application/json

{
  "email": "teszt@email.com",
  "password": "jelszo123"
}
```

### Védett végpont hívása
```bash
GET http://localhost:3000/users
Authorization: Bearer eyJhbGciOiJIUzI1...
```
