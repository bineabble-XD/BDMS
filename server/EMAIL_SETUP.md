# Email Setup (Appointment Approval Notifications)

When a hospital approves a donor's booking, the system sends an email to the donor. Configure your Gmail in `.env` to enable this.

## Steps

1. **Open `server/.env`** and set:
   ```
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASS=your_16_char_app_password
   ```

2. **Create a Gmail App Password:**
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable **2-Step Verification** if not already on
   - Go to **App passwords** (or search "App passwords" in Google Account)
   - Generate a new app password for "Mail" → "Other" (e.g. "BDMS")
   - Copy the 16-character password (no spaces) into `EMAIL_PASS`

3. **Restart the server** after changing `.env`.

## Testing

1. As a donor, book an appointment at a hospital
2. As that hospital, approve the booking (HosDash → Approve)
3. The donor should receive an email: "Your Blood Donation Appointment Has Been Approved"
