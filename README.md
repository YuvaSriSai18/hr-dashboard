# 💼 HR Dashboard – Submission

## 🔗 **GitHub Repository**

- **GitHub repository link** - [https://github.com/YuvaSriSai18/hr-dashboard](https://github.com/YuvaSriSai18/hr-dashboard)

- **Deployed Link** - [https://hr-dashboard-steel.vercel.app/](https://hr-dashboard-steel.vercel.app/)
---

## 🚀 **Project Setup & Running**

### 🛠️ Installation

```bash
git clone https://github.com/YuvaSriSai18/hr-dashboard.git
cd hr-dashboard
npm install
npm run dev
```


---

## ✅ **Features Implemented**

### 1. 🏠 **Dashboard Homepage (`/`)**

* ✅ User cards fetched from `https://dummyjson.com/users?limit=20`
* ✅ Rendered full name, email, age, department (mocked via logic)
* ✅ Performance rating bar (1–5 stars)
* ✅ Actions: `View`, `Bookmark`, `Promote` (UI)

### 2. 🔍 **Search & Filter**

* ✅ Search by name, email, department (case-insensitive)
* ✅ Multi-select filters for department & performance rating

### 3. 👤 **Dynamic User Details Page (`/employee/[id]`)**

* ✅ Tabs: `Overview`, `Projects`, `Feedback`
* ✅ Detailed user info: phone, address, bio, rating
* ✅ Past performance list (randomized)

### 4. 📌 **Bookmark Manager (`/bookmarks`)**

* ✅ View all bookmarked users
* ✅ Actions: `Remove`, `Promote`, `Assign to Project` (UI only)

### 5. 📊 **Analytics Page (`/analytics`)**

* ✅ Charts using `recharts`

  * Department-wise average ratings
  * Bookmark trends (mocked)
* ✅ Server-side static generation used (if applicable)

---

## 🌈 **Tech Stack**

* **Framework:** Next.js (App Router)
* **Styling:** Tailwind CSS + Tailwind Animations
* **State Management:** Context API
* **Forms & Validation:** `react-hook-form` + `zod`
* **Charts:** `recharts`
* **Dark Mode:** `next-themes`
* **Icons/UI:** `lucide-react`, `Shadcn`

---

## 💎 **Bonus Features**

* ✅ **Mock Login** page for authentication flow
* ✅ Create User modal/page (with validation)
* ✅ Responsive across devices
* ✅ Accessible components (keyboard navigable)
* ✅ Paginated user list or Infinite Scroll (if added)

---

## 📂 **Project Structure**

```
/components      → UI components (Card, Button, Tabs, etc.)
/hooks           → Custom hooks (useBookmarks, useSearch, etc.)
/app             → Next.js App Router Pages (/bookmarks, /analytics)
/lib             → Helper logic, types, and constants
/public          → Static assets
```

---

## 📸 **Screenshots**

> ![alt tex](src\assets\1.png)
---
> ![alt tex](src\assets\2.png)
---
> ![alt tex](src\assets\3.png)
---
> ![alt tex](src\assets\4.png)
---
> ![alt tex](src\assets\5.png)
---
> ![alt tex](src\assets\6.png)
---
> ![alt tex](src\assets\7.png)
---
> ![alt tex](src\assets\8.png)
---
> ![alt tex](src\assets\9.png)
---
> ![alt tex](src\assets\10.png)
---
