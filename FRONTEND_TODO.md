# 🎯 Brain Battle 3.0 - Frontend Development Roadmap

## 📱 Project Overview for Frontend Developers

**Brain Battle 3.0** is a tournament registration system for college events. The backend provides APIs for:

- Participant registration with QR code generation
- QR code scanning at event gates
- Admin dashboard for tournament management

---

## 🎯 Phase 1: Participant Registration Page

### 1.1 Registration Form UI

- [ ] Create responsive registration page (`/register`)
- [ ] Design form with fields:
  - **Name** (required, text input)
  - **Email** (required, email validation)
  - **Phone** (optional, mobile number format)
  - **College** (optional, text input or dropdown)
- [ ] Add form validation with helpful error messages
- [ ] Implement submit button with loading state

**API Integration:**

```
POST /api/register
Body: { name, email, phone?, college? }
Response: { participant: {...}, qrDataUrl: "data:image/png;base64,..." }
```

### 1.2 QR Code Display After Registration

- [ ] Display generated QR code from `qrDataUrl` response
- [ ] Show confirmation message with participant details
- [ ] Add "Download QR" button to save as PNG
- [ ] Display the 8-character unique code prominently
- [ ] Add success confirmation with participant info:
  - Name
  - Email
  - Unique Code
  - QR Code Image

### 1.3 Success Page Features

- [ ] Show countdown timer if event date is known
- [ ] Display event details and instructions
- [ ] Add button to download QR as image
- [ ] Option to print QR code
- [ ] "Share with friends" or social media links (optional)

---

## 🎯 Phase 2: QR Code Scanner Page

### 2.1 Scan Interface

- [ ] Create scanner page (`/scan`)
- [ ] Implement QR code scanner library (e.g., `qrcode.js`, `jsQR`)
- [ ] Add camera access UI:
  - Request camera permissions
  - Show camera feed/video stream
  - Display scanning UI overlay with guidelines

### 2.2 Scanning Logic

- [ ] Parse scanned QR payload: `{id, code, name}`
- [ ] Send to backend `/api/register/scan` endpoint
- [ ] Handle two scenarios:
  - Raw code scanning
  - Full JSON payload scanning

**API Integration:**

```
POST /api/register/scan
Body: { code: "abc12345" } OR { payload: "{...}" }
Response: { participant: {...} }
```

### 2.3 Scan Results Display

- [ ] Show participant details after successful scan:
  - Name
  - Email
  - Unique Code
  - Photo/Avatar (if available)
- [ ] Display success animation/confirmation
- [ ] Show timestamp of scan
- [ ] Add "Scan Again" button
- [ ] Error handling for:
  - Invalid QR codes
  - Non-existent participants
  - Duplicate scans (optional check)

### 2.4 Scanner Features

- [ ] Toggle between front/rear camera
- [ ] Manual code entry fallback (if QR fails)
- [ ] Sound/vibration feedback on successful scan
- [ ] Beep or visual confirmation
- [ ] Clear scanning history or recent scans list

---

## 🎯 Phase 3: Admin Dashboard

### 3.1 Admin Login Page

- [ ] Create login page (`/admin/login`)
- [ ] Password input field
- [ ] Login button with loading state
- [ ] Store JWT token in localStorage/sessionStorage
- [ ] Redirect to dashboard on successful login

**API Integration:**

```
POST /api/admin/login
Body: { password: "..." }
Response: { token: "jwt_token_here" }
```

### 3.2 Participants Management Page

- [ ] Display table/list of all participants
- [ ] Show columns:
  - Participant Name
  - Email
  - Phone
  - College
  - Unique Code
  - Registration Date
  - Actions (view, edit, delete)
- [ ] Implement search/filter functionality:
  - Filter by name
  - Filter by college
  - Filter by registration date
- [ ] Add pagination if many participants
- [ ] Export participants to CSV/Excel (optional)

**API Integration:**

```
GET /api/admin/participants
Headers: { Authorization: "Bearer {token}" }
Response: { participants: [...] }
```

### 3.3 Round Management Page

- [ ] Display list of tournament rounds
- [ ] Show fields:
  - Round Name
  - Round Status (pending, active, completed)
  - Number of Participants
  - Created Date
- [ ] Create new round button/form:
  - Round name input
  - Round description (optional)
  - Save button

**API Integration:**

```
POST /api/admin/rounds
Headers: { Authorization: "Bearer {token}" }
Body: { name: "...", status: "..." }
Response: { round: {...} }
```

### 3.4 Participant Assignment to Rounds

- [ ] Create interface to assign participants to rounds
- [ ] Display available rounds
- [ ] Display available participants
- [ ] Drag-and-drop assignment (optional) or checkbox selection
- [ ] Bulk assignment functionality
- [ ] Show assignment status per participant per round:
  - Registered
  - Passed
  - Eliminated

**API Integration:**

```
POST /api/admin/rounds/{roundId}/assign
Headers: { Authorization: "Bearer {token}" }
Body: { participantId: "...", status: "..." }
Response: { participantRound: {...} }
```

### 3.5 Dashboard Overview/Analytics

- [ ] Show key statistics:
  - Total participants registered
  - Total rounds created
  - Participants per round
  - Registration rate/progress
- [ ] Display chart/graph of registrations over time
- [ ] Show status summary (pie chart or similar)

---

## 🎯 Phase 4: Supporting Pages

### 4.1 Navigation & Layout

- [ ] Create main navigation/header:
  - Logo
  - Navigation links
  - User menu (logout for admin)
- [ ] Create footer with event info
- [ ] Implement responsive mobile menu
- [ ] Add breadcrumb navigation

### 4.2 Event Details/Information Page

- [ ] Create `/info` or `/about` page
- [ ] Display event information:
  - Event name: "Brain Battle 3.0"
  - Event date and time
  - Venue/Location
  - Event description
  - Rules and guidelines
  - Prizes (if applicable)
- [ ] Link to social media
- [ ] Contact information

### 4.3 Error Pages

- [ ] 404 Page (Not Found)
- [ ] 500 Page (Server Error)
- [ ] Custom error messages for API failures
- [ ] Retry buttons on error pages

### 4.4 Help/FAQ Page

- [ ] FAQ section about registration
- [ ] How to use QR scanner
- [ ] Troubleshooting guide
- [ ] Contact support information

---

## 🎯 Phase 5: Advanced Features

### 5.1 QR Code Management

- [ ] View participant QR code from admin panel
- [ ] Regenerate QR code if lost
- [ ] Download individual QR codes as PDF
- [ ] Batch download QR codes for all participants

### 5.2 Notifications & Alerts

- [ ] Email confirmation after registration
- [ ] Email with QR code attachment (optional)
- [ ] In-app notifications for admin actions
- [ ] Toast/snackbar messages for user feedback

### 5.3 Participant Profile

- [ ] Create participant profile page (`/profile`)
- [ ] Show participant details
- [ ] Display QR code
- [ ] Allow to download QR
- [ ] Show which rounds they're assigned to

### 5.4 Round Details Page

- [ ] Create round details page (`/admin/rounds/:roundId`)
- [ ] List all participants in that round
- [ ] Show participant status (registered/passed/eliminated)
- [ ] Update participant status
- [ ] Generate round results/standings

### 5.5 Leaderboard/Results

- [ ] Create leaderboard page showing:
  - Participant rankings
  - Points/Scores (if applicable)
  - Round progression
- [ ] Filter by round
- [ ] Export results

---

## 🛠️ Technical Setup Requirements

### Frontend Stack (Recommended)

- **Framework:** React.js, Vue.js, or Next.js
- **Styling:** Tailwind CSS, Bootstrap, or Material-UI
- **State Management:** Redux, Zustand, or Context API
- **HTTP Client:** Axios or Fetch API
- **QR Scanner:** `qrcode.js` or `jsQR`
- **QR Generator Display:** Native image or `qrcode.react`

### Key Libraries Needed

```json
{
  "axios": "^1.x.x",
  "qrcode": "^1.x.x",
  "qrcode.react": "^1.x.x",
  "jsqr": "^1.x.x",
  "react-router-dom": "^6.x.x"
}
```

### Environment Setup

- Backend URL: `http://localhost:4000/api` (or production URL)
- Environment variables file: `.env.local`

```
VITE_API_URL=http://localhost:4000/api
VITE_JWT_STORAGE_KEY=admin_token
```

---

## 📋 User Flows

### Registration User Flow

1. User lands on home page
2. Clicks "Register for Brain Battle 3.0"
3. Fills registration form (name, email, optional phone/college)
4. Submits form
5. Backend generates unique code + QR
6. Frontend displays:
   - Success message
   - Participant details
   - QR code (data URL)
   - Download/Print options
7. User can download or print QR code
8. User receives email confirmation (optional)

### Scanner User Flow (At Event Gate)

1. Event staff opens scanner page
2. Allows camera access
3. Points camera at participant's QR code
4. System scans and extracts code
5. Backend verifies participant
6. Display shows:
   - Participant name
   - Confirmation checkmark
   - Sound/vibration feedback
7. Staff clicks "Scan Next" to continue

### Admin User Flow

1. Admin logs in with password
2. Dashboard shows overview stats
3. Admin can:
   - View all participants list
   - Create tournament rounds
   - Assign participants to rounds
   - Update participant status
   - Download reports
4. Admin logout

---

## 🎨 UI/UX Considerations

### Responsive Design

- Mobile-first approach
- Works on phones, tablets, desktops
- Touchscreen-friendly buttons and inputs
- Large touch targets (min 44x44px)

### Accessibility

- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader friendly
- Color contrast ratios
- Alt text for QR codes

### Performance

- Optimize images and assets
- Lazy loading for large lists
- Debounce search/filter inputs
- Cache API responses where appropriate

### User Experience

- Clear error messages
- Loading states for async operations
- Confirmation dialogs for destructive actions
- Undo/Redo where applicable
- Fast page transitions

---

## 🧪 Testing Checklist

### Unit Tests

- [ ] Form validation functions
- [ ] QR code parsing logic
- [ ] API call error handling
- [ ] Date/time formatting

### Integration Tests

- [ ] Registration flow end-to-end
- [ ] Scanner flow with mock QR
- [ ] Admin login and access control
- [ ] Participant assignment workflow

### E2E Tests

- [ ] Complete user registration journey
- [ ] Admin dashboard operations
- [ ] Scanner functionality
- [ ] Authentication and authorization

### Manual Testing

- [ ] Test on mobile devices
- [ ] Test offline handling
- [ ] Test different browsers (Chrome, Firefox, Safari)
- [ ] Test with slow network (throttling)
- [ ] Test with camera disabled/denied
- [ ] Test QR scanning with various QR sizes

---

## 📱 Mobile Considerations

### Camera Access

- Request permission gracefully
- Handle denied permissions
- Fallback to manual code entry
- Show instructions for camera access

### Performance

- Minimize bundle size
- Optimize for slower networks
- Reduce image file sizes
- Lazy load components

### Touch Optimization

- Large buttons and tap targets
- Swipe gestures for navigation
- Haptic feedback
- Portrait and landscape support

---

## 🔐 Security Considerations

### Authentication

- Store JWT token securely (httpOnly cookies preferred)
- Refresh token before expiry
- Clear token on logout
- Validate token on page load

### Input Validation

- Sanitize form inputs
- Validate email format
- Prevent XSS attacks
- CSRF protection

### API Security

- Use HTTPS only
- Send Authorization headers with admin requests
- Handle 401 Unauthorized responses
- Clear sensitive data from logs

---

## 📦 Deployment Checklist

- [ ] Environment variables configured
- [ ] API endpoints point to correct server
- [ ] Build process optimized
- [ ] Assets minified and compressed
- [ ] Source maps removed from production
- [ ] Analytics/monitoring configured
- [ ] Error tracking (Sentry, etc.) set up
- [ ] Performance monitoring enabled

---

## 📞 API Reference Quick Links

**Base URL:** `http://localhost:4000/api`

| Endpoint                        | Method | Auth | Purpose                 |
| ------------------------------- | ------ | ---- | ----------------------- |
| `/register`                     | POST   | No   | Register participant    |
| `/register/:code`               | GET    | No   | Get participant by code |
| `/register/qr/:code`            | GET    | No   | Get QR image            |
| `/register/scan`                | POST   | No   | Scan QR code            |
| `/admin/login`                  | POST   | No   | Admin login             |
| `/admin/participants`           | GET    | Yes  | List participants       |
| `/admin/rounds`                 | POST   | Yes  | Create round            |
| `/admin/rounds/:roundId/assign` | POST   | Yes  | Assign participant      |

---

## 🎯 Priority & Timeline Suggestion

**Week 1-2:** Phase 1 (Registration)
**Week 3:** Phase 2 (Scanner)
**Week 4:** Phase 3 (Admin Dashboard)
**Week 5:** Phase 4 (Supporting Pages)
**Week 6+:** Phase 5 (Advanced Features)

---

## 🤝 Communication with Backend Team

- [ ] Confirm exact API response formats
- [ ] Clarify QR payload structure
- [ ] Discuss error response format
- [ ] Plan rate limiting strategy
- [ ] Define pagination limits
- [ ] Confirm CORS configuration
- [ ] Test APIs with Postman before coding

---

**Last Updated:** October 19, 2025
**Backend Status:** ✅ Complete and Ready
