# Vue 3 Autentikációs Alkalmazás Dokumentáció

## 1. Bevezetés és áttekintés

Ez az alkalmazás egy egyszerű, de biztonságos autentikációs rendszert mutat be Vue 3 környezetben. Az alkalmazás lehetővé teszi a felhasználók számára a regisztrációt, bejelentkezést és egy védett profil oldal elérését.

### 1.1. Használt technológiák

- **Frontend:**

  - Vue 3 (Composition API)
  - Vue Router (útvonalkezelés)
  - Pinia (állapotkezelés)
  - Axios (HTTP kérések)
  - TypeScript

- **Backend:**
  - JSON Server (egyszerű REST API)
  - JWT (JSON Web Token) - biztonságos autentikáció
  - bcrypt - jelszó titkosítás

## 2. Működési alapelvek

### 2.1. JWT (JSON Web Token)

A JWT egy nyílt szabvány, amely biztonságos módot kínál információk továbbítására JSON objektumként. Három részből áll:

- Header
- Payload
- Signature

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIn0.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

### 2.2. Bcrypt jelszó titkosítás

A bcrypt egy jelszó-hashelő függvény, amely:

- Adaptív függvény, amely lassítja a brute force támadásokat
- Példa egy hashelt jelszóra:
  ```
  $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
  ```

## 3. Alkalmazás komponensei

### 3.1. Frontend struktúra

```
src/
├── stores/
│   └── auth.js         # Pinia auth store
├── views/
│   ├── LoginView.vue   # Bejelentkezési oldal
│   ├── RegisterView.vue # Regisztrációs oldal
│   └── ProfileView.vue # Védett profil oldal
└── router/
    └── index.js        # Útvonalak és védelem
```

### 3.2. Auth Store működése

```javascript
const login = async (credentials) => {
  try {
    const response = await axios.post('/login', credentials)
    setToken(response.data.token)
    user.value = response.data.user
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
```

### 3.3. Védett útvonalak

A router egy "navigation guard"-ot használ:

```javascript
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})
```

## 4. Biztonsági megfontolások

### 4.1. Frontend biztonság

1. **Token tárolás:**

   - A JWT token localStorage-ban van tárolva
   - ⚠️ XSS támadások ellen védeni kell
   - Érzékeny adatokat ne tároljunk a token payload-jában

2. **CSRF védelem:**
   - Az Axios alapértelmezetten küldi a CSRF tokent
   - Minden módosító kérés használjon megfelelő HTTP metódust

### 4.2. Backend biztonság

1. **Jelszó tárolás:**

   - Soha nem tároljuk plain textben
   - Bcrypt használata kötelező
   - Megfelelő "salt rounds" használata (általában 10-12)

2. **Token biztonság:**
   - Rövid lejárati idő (1 óra)
   - Biztonságos titkos kulcs használata
   - Token visszavonás lehetősége

### 4.3. Általános biztonsági tippek

- Használj HTTPS-t produkcióban
- Implementálj rate limiting-et
- Figyelj a jelszó erősségre
- Készíts naplózást (logging)
- Rendszeresen frissítsd a függőségeket

## 5. Hibakezelés

### 5.1. Gyakori hibák és megoldások

1. **401 Unauthorized:**

   - Token lejárt
   - Érvénytelen token
   - Megoldás: újra bejelentkezés

2. **400 Bad Request:**
   - Hiányzó mezők
   - Érvénytelen email formátum
   - Megoldás: input validáció

## 6. Jövőbeli fejlesztési lehetőségek

1. Token frissítés (refresh token) implementálása
2. Jelszó visszaállítás funkció
3. OAuth integráció
4. Többszintű jogosultságkezelés
5. Kéttényezős autentikáció (2FA)

## 7. Példa használati esetek

### 7.1. Regisztráció folyamata

1. Felhasználó kitölti a regisztrációs űrlapot
2. Frontend validálja az adatokat
3. Backend ellenőrzi az email egyediségét
4. Jelszó hashelése bcrypt-tel
5. Felhasználó mentése és token generálás
6. Automatikus bejelentkezés

### 7.2. Védett erőforrás elérése

1. Felhasználó megpróbál elérni egy védett oldalt
2. Router guard ellenőrzi a token meglétét
3. Backend validálja a tokent
4. Sikeres validáció esetén erőforrás szolgáltatása

## 8. Hibaelhárítási útmutató

### 8.1. CORS hibák

```javascript
// server.js
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
)
```

### 8.2. Token lejárat kezelése

```javascript
// auth.js store
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      // Token lejárt, irányítás a login oldalra
      router.push('/login')
    }
    return Promise.reject(error)
  }
)
```

## 9. Tesztelés

### 9.1. Mit teszteljünk?

1. Regisztráció működése
2. Bejelentkezés működése
3. Token kezelés
4. Védett útvonalak működése
5. Hibakezelés megfelelősége

### 9.2. Tesztelési tippek

- Használj érvénytelen adatokat
- Próbálj lejárt tokennel kérést küldeni
- Ellenőrizd a jelszó titkosítást
- Teszteld a logout működését

## 10. Gyakorlati feladatok

1. Implementálj jelszó-visszaállítás funkciót
2. Adj hozzá profil szerkesztési lehetőséget
3. Készíts admin felületet
4. Implementálj session kezelést
5. Adj hozzá social login lehetőséget

## 11. Összefoglalás

Ez az alkalmazás egy alapszintű, de biztonságos autentikációs rendszert mutat be. A JWT és bcrypt használatával megbízható védelmet nyújt, miközben a Vue 3 modern funkcióit használja a felhasználói felület kezelésére.
