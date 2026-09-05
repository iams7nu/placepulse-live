# Local Pulse

Build a modern, scalable web app + mobile app called [APP NAME] that acts as a real-time, privacy-first local information and communication network.

The core idea is to allow people to discover what is happening at a particular place or business in real time, communicate with relevant people without exposing personal phone numbers or unnecessary personal information, and eventually interact with businesses directly through the platform.

1. CORE CONCEPT

The platform should combine:

- Real-time location awareness
- Crowdsourced information
- Anonymous or privacy-preserving interactions
- Internet-based voice calling
- Business/company discovery
- Live availability/status information
- Privacy-preserving ordering and communication
- User-controlled location sharing

Users should be able to search for a place, shop, restaurant, company, organization, or general area and see useful real-time information contributed by people who are currently there or recently interacted with that location.

For example:

A user searches for:

«"ABC Electronics"»

The app could show:

- Open / closed
- Estimated current activity
- People currently reporting that the location is active
- Available jobs
- Business information
- User-submitted updates
- Ability to contact the business or an opted-in employee
- Eventually, ability to order products/services

The platform should NOT expose users' private phone numbers, exact personal locations, or other sensitive information unless they explicitly choose to share them.

---

2. IMPORTANT PRIVACY PRINCIPLE

Privacy must be a fundamental part of the architecture.

Do NOT simply display people's GPS coordinates to other users.

Instead, use location data to determine presence within a relevant geographic area while keeping the person's exact location private.

For example:

If a user is physically near a restaurant, the system may use their device location to determine:

«"Someone is currently near/at this restaurant."»

But other users should NOT see:

«"John is at 40.712812, -74.006021."»

Location information should be processed using appropriate privacy-preserving techniques such as:

- Geofencing
- Approximate location
- Location zones
- Temporary presence tokens
- Aggregation
- Minimum-user thresholds
- Data minimization
- User-controlled location permissions

Users must be able to:

- Enable/disable location sharing
- Choose when location is collected
- Choose whether they participate in crowdsourced updates
- Delete their location history
- Control who can contact them
- Block users
- Report abuse
- Appear anonymously where appropriate

Do not store unnecessary historical location data.

---

3. LIVE LOCATION / PRESENCE SYSTEM

The mobile application should be capable of periodically determining the device's location while respecting operating-system background-location restrictions and battery limitations.

The original concept is approximately one location update per minute, but do not blindly force a 1-minute GPS request if the operating system, battery, permissions, or privacy requirements make that inappropriate.

Design an intelligent location system that can use:

- GPS
- Wi-Fi positioning
- Cellular positioning
- Geofencing
- Significant-location-change detection

The backend should determine whether a user is likely present within a defined area.

For example:

Restaurant A has a geofence.

Several opted-in users are currently detected within the relevant area.

The system can generate:

«"Restaurant A appears to be active right now."»

Do not reveal individual users.

The system should also calculate confidence levels where appropriate.

Example:

Open status: Likely Open

- 8 recent presence signals
- Last activity: 2 minutes ago
- Confidence: High

---

4. CROWDSOURCED LIVE UPDATES

Users should be able to anonymously or pseudonymously provide real-time information.

Examples:

Shop

User searches:

«"XYZ Clothing"»

The app displays:

Likely Open

«5 people recently reported activity here.»

Possible user updates:

- Open
- Closed
- Very busy
- Not busy
- Long queue
- Short queue
- Out of stock
- Temporarily closed
- Staff available
- Event happening
- Other custom report

Users should be able to submit reports with minimal effort.

The system should automatically attach the relevant location/place rather than requiring users to reveal their identity.

Implement anti-spam and abuse protection.

---

5. BUSINESS / PLACE PAGES

Every business, organization, company, restaurant, shop, or other location should have a dedicated page.

Example:

ABC Restaurant

Status: Likely Open

Live activity: Moderate

Recent updates:

- Open 3 min ago
- Busy 7 min ago
- Menu updated 1 hour ago

Buttons:

- Call
- Message
- Directions
- View information
- Report update
- Order (future feature)

Businesses should eventually be able to claim and verify their pages.

Verified businesses should receive a verification badge.

---

6. PRIVACY-PRESERVING INTERNET CALLING

The platform should support voice calling through the internet.

Calls should use technologies such as:

- WebRTC
- VoIP
- Secure signaling
- STUN/TURN infrastructure where required

Do NOT expose the user's personal phone number to the other party.

For example:

User searches:

«"ABC Electronics"»

They press:

Call

The call should be routed through the platform.

The caller should not need to know the employee's personal phone number.

The employee should not need to expose their personal phone number.

The system should provide controls for:

- Accept call
- Reject call
- Block caller
- Report caller
- Call availability
- Business-hours availability
- Anonymous/pseudonymous calling

---

7. COMPANY / EMPLOYEE DIRECTORY

One major feature is allowing people to discover employees or representatives who voluntarily connect their account to an organization.

Example:

A person works at:

«Microsoft»

They choose to link their verified account with Microsoft.

Another user searches:

«Microsoft»

The app may show:

Microsoft

Employees who have opted into contact discovery may appear as:

- HR contact
- Recruiter
- Sales representative
- Support representative
- General contact
- Other role

The person can be contacted through the app without revealing their personal phone number.

IMPORTANT:

Employees must explicitly opt in.

The system must NEVER automatically expose employees simply because GPS data suggests that they work at a particular company.

Company affiliation should require explicit verification or user-controlled linking.

---

8. JOB AVAILABILITY

Users should be able to search for jobs or employment opportunities.

Example:

User searches:

«"ABC Company"»

The company page could show:

Hiring now

- Software Engineer
- Sales Associate
- Accountant
- Warehouse Worker

Users could contact an authorized recruiter through the app.

The user's personal phone number should not need to be shared.

Possible future feature:

"Is this company hiring right now?"

People currently connected to the company can optionally provide crowdsourced information such as:

«"Hiring"»

«"Not currently hiring"»

«"Walk-in interviews today"»

These reports should be clearly labeled as community reports unless verified by the company.

---

9. RESTAURANT / SHOP ORDERING — FUTURE FEATURE

Design the architecture so that ordering can be added later.

Users should eventually be able to order directly from:

- Restaurants
- Grocery stores
- Retail stores
- Local shops
- Other outlets

The goal is to minimize unnecessary personal-data sharing.

For example, the customer should not necessarily need to give the restaurant:

- Personal phone number
- Exact home address
- Personal email

Instead, communication and order coordination can happen through the platform.

However, delivery logistics may require some location/address information when necessary.

Use privacy-preserving location sharing rather than exposing more information than is required.

Example flow:

1. User selects restaurant.
2. User selects food.
3. User places order.
4. Restaurant receives order.
5. Platform handles communication.
6. Delivery location is shared only when necessary.
7. Customer can communicate with restaurant/delivery service through the app.

Make this modular so it can be implemented in a later version.

---

10. GLOBAL INTERNET CALLING

The application should be designed for global communication.

Users should be able to communicate with people/businesses in different countries through internet-based calling.

Do NOT assume that traditional cellular networks are required.

However, clearly separate:

Internet calling

From:

Calling a traditional phone number

The initial implementation should prioritize internet-to-internet calls.

If traditional phone/SIP/PSTN calling is added later, design it as a separate service because it may require telecommunications providers, country-specific regulations, identity verification, and additional infrastructure.

---

11. SATELLITE / OUTER-WORLD COMMUNICATION

The product vision includes the possibility of communicating from anywhere in the world, including environments where satellite connectivity is available.

Do NOT pretend that the app itself can magically provide satellite connectivity.

Instead, design the networking layer so it can eventually work over:

- Normal mobile internet
- Wi-Fi
- Satellite internet
- Other compatible internet connections

The application should simply require an IP/network connection for internet communication.

If satellite hardware/providers become available, the app should be able to use their internet connection like any other network.

Treat direct satellite communication as a future integration, not a feature that can be assumed to work in the MVP.

---

12. USER TYPES

Create the following user roles.

Normal User

Can:

- Search places
- View live updates
- Submit reports
- Make calls
- Receive calls
- Follow places
- Manage privacy settings
- Block/report users

Business User

Can:

- Claim business
- Verify business
- Update business information
- Receive calls
- Receive messages
- Manage employees
- Post job opportunities
- Eventually receive orders

Employee / Professional

Can:

- Link their account to an organization
- Verify employment where supported
- Choose whether to be discoverable
- Select their role
- Receive calls/messages
- Hide their personal phone number

Administrator

Can:

- Moderate content
- Manage reports
- Manage businesses
- Manage users
- Detect abuse
- Manage verification
- Review suspicious activity
- Handle privacy/security incidents

---

13. SEARCH EXPERIENCE

Create a powerful global search.

Users can search:

- Business names
- Companies
- Restaurants
- Shops
- People who have opted into discovery
- Jobs
- Locations
- Categories

Example searches:

«Starbucks»

«Restaurants near me»

«Jobs at Tesla»

«Electronics shops»

«ABC Hospital»

«Open pharmacies»

«People available at ABC Company»

Results should prioritize relevant nearby or currently active information.

---

14. LIVE STATUS

Every place should have a dynamic status.

Possible states:

🟢 Likely Open
🔴 Likely Closed
🟡 Uncertain
🔵 Temporarily Closed
⚪ No Recent Data

The status should be calculated using a combination of:

- Official business hours
- Business-provided status
- Recent community reports
- Recent presence signals
- Time of day
- Other trusted signals

Never present crowdsourced information as guaranteed fact.

Show:

«"Community-reported"»

or

«"Estimated from recent activity"»

where appropriate.

---

15. HOME SCREEN

Design a clean modern home screen.

Include:

- Search bar
- Nearby activity
- Places around me
- Live updates
- Popular locations
- Jobs nearby
- Recently searched places
- Quick "Report update" button

Example:

What's happening around you?

[ Search places, companies, jobs... ]

Near You

ABC Restaurant
🟢 Likely Open
Recent activity: 2 min ago

XYZ Pharmacy
🟢 Likely Open
3 community updates

TechCorp
💼 Hiring
2 active job listings

---

16. MAP

Include an optional interactive map.

Show:

- Businesses
- Places
- Activity areas
- Public events
- User reports

Do NOT show exact locations of anonymous users.

Instead, show aggregated activity.

For example:

«12 people recently active in this area»

rather than showing 12 individual user locations.

---

17. USER PROFILE

Profiles should be privacy-first.

Possible information:

- Username
- Profile photo (optional)
- Verification status
- Interests
- Contributions
- Organizations voluntarily linked
- Contact availability

Users should be able to choose:

Public / Limited / Private

for different types of information.

Do not require users to publicly reveal their real identity unless legally or operationally necessary.

---

18. CONTACT SYSTEM

Create an internal contact identity system.

Each user should have an internal platform ID.

Do not use the user's phone number as their public identity.

For example:

Internal:

"user_839271"

Public:

"@alex"

Phone number:

Private

Calls/messages should be routed using internal IDs.

---

19. SECURITY

Build security into the architecture from the beginning.

Include:

- End-to-end encryption where appropriate
- Encryption in transit
- Encryption at rest
- Secure authentication
- OAuth/passkeys where appropriate
- Rate limiting
- Abuse detection
- Spam protection
- Account recovery
- Session management
- Device management
- Block/report functionality
- Audit logs for sensitive administrative actions

Never expose:

- Passwords
- Private phone numbers
- Exact private GPS history
- Authentication tokens
- Private communications

---

20. LOCATION SECURITY

Location is extremely sensitive.

Implement:

- Explicit permission
- Clear consent screens
- Background-location disclosure
- Location collection controls
- Data retention limits
- Approximate-location options
- Geofence-based processing
- Automatic deletion of unnecessary location records

Users should be able to see what location permissions they have granted.

Provide:

Pause Location Sharing

and:

Delete Location Data

buttons.

---

21. ANTI-ABUSE SYSTEM

Because users can contact other people, the application must prevent harassment and spam.

Implement:

- Block
- Report
- Mute
- Call limits
- Message limits
- Spam detection
- Suspicious-account detection
- Business verification
- Employee opt-in
- Abuse reports
- Moderation dashboard

Users should never be automatically discoverable simply because their phone is physically near a location.

---

22. TECHNICAL ARCHITECTURE

Build the application using a scalable architecture.

Suggested stack:

Frontend

- Next.js / React for web
- React Native or Flutter for mobile
- Responsive design
- PWA support where practical

Backend

- Node.js / TypeScript
- REST API and/or GraphQL
- WebSocket support for live updates

Database

Use PostgreSQL with PostGIS for geographic queries.

Potential supporting infrastructure:

- Redis for caching/realtime state
- Object storage for media
- Queue system for background processing
- WebRTC infrastructure for calls
- Push notification service

Use a modular architecture so services can be separated as the platform grows.

---

23. REAL-TIME ARCHITECTURE

The application should support real-time updates.

When a relevant event occurs:

Example:

«Someone reports that a store has opened.»

Nearby/relevant users may receive:

«"ABC Store has a new community update."»

Use:

- WebSockets
- Server-sent events where appropriate
- Push notifications

Do not continuously send unnecessary updates to users.

---

24. DATA MODEL

Create appropriate database models/entities for at least:

- Users
- User privacy settings
- Devices
- Locations/places
- Businesses
- Organizations
- Employees
- Organization memberships
- Job postings
- Community reports
- Presence signals
- Calls
- Messages
- Notifications
- Orders (future)
- Reviews/reports
- Verification records
- Abuse reports
- Audit logs

Use proper relationships and indexes, especially geographic indexes.

---

25. MVP

Do NOT attempt to build every feature at once.

Build the first version around these features:

MVP FEATURES

1. User registration/login
2. Privacy settings
3. Location permission
4. Approximate/geofenced location
5. Search for places/businesses
6. Business pages
7. Community live-status reports
8. Open/closed estimation
9. Nearby activity
10. Anonymous/pseudonymous reporting
11. User blocking/reporting
12. Basic internet voice calling
13. Basic business accounts

Make the architecture ready for:

- Employee directories
- Job availability
- Business verification
- Ordering
- Advanced communications
- Satellite connectivity

---

26. UI/UX DESIGN

Use a clean, modern interface similar in quality to leading consumer apps.

Design principles:

- Simple
- Fast
- Minimal
- Privacy-focused
- Mobile-first
- Accessible
- Easy for non-technical users

Use clear status colors but do not rely only on color for accessibility.

The main experience should be:

Search → Discover → Verify information → Contact

Avoid overwhelming the user with technical information.

---

27. IMPORTANT PRODUCT RULES

Follow these rules throughout the application:

1. Never expose a person's exact location to strangers by default.
2. Never expose a personal phone number unless the user explicitly chooses to share it.
3. Never make someone discoverable merely because they are physically near a place.
4. Employment/company linking must be voluntary.
5. Community reports must be distinguished from verified information.
6. Location tracking must require appropriate consent and comply with mobile OS restrictions.
7. Do not promise functionality that depends on unavailable satellite hardware/networks.
8. Minimize collection and retention of sensitive data.
9. Give users meaningful privacy controls.
10. Build the system so privacy is enforced at the backend, not just hidden in the UI.

---

28. FIRST BUILD

Start by creating a fully functional MVP rather than a static mockup.

Build:

- Responsive web application
- Mobile-friendly interface
- Authentication
- Database
- Business/place search
- Map
- Location permissions
- Crowdsourced status reporting
- Live status calculation
- Privacy settings
- User blocking/reporting
- Basic internet calling architecture
- Admin dashboard

Use realistic sample data where external APIs or services are unavailable.

Clearly mark simulated functionality.

Do not claim that GPS tracking, background location, WebRTC calling, SMS/PSTN calling, or satellite connectivity works unless it is actually implemented and tested.

The final product should feel like a real global, privacy-first, crowdsourced live-information and communication network, not merely a directory or social-media application.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/273cbd17-8b0d-4c04-8645-2582cd00181e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
