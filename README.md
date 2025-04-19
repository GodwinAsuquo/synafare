# Facebook Conversions API Implementation Guide

This guide explains how to implement Facebook's Conversions API on your Synafare website.

## Setup Overview

1. **Server-Side Tracking**: Using Conversions API to send events from your server
2. **Client-Side Tracking**: Using Meta Pixel to track events in the browser
3. **Deduplication**: Facebook automatically deduplicates events between Pixel and Conversions API

## Implementation Steps

### 1. Install the Facebook Pixel

The Facebook Pixel has been added to `index.html` to provide client-side tracking.

### 2. Set Up Meta Service

The `meta.service.ts` file contains the core functionality for the Conversions API:

- Creates properly formatted payloads
- Sends events to Facebook via API
- Handles hashing of user data

### 3. React Integration via Hooks

The `useMeta.ts` hook provides easy access to tracking functions in your components:

```typescript
// Example usage
const { trackCompleteRegistration } = useMetaEvents();

// Track an event
trackCompleteRegistration({
  userData: {
    em: ['user@example.com'],
    ph: ['1234567890']
  },
  customData: {
    // Any additional data you want to track
  }
});
```

### 4. Track Key Events

#### Complete Registration (ZohoSolarForm)

The solar form tracks registration completion when a user submits the form.

#### Contact (Footer)

The footer tracks contact events when a user clicks on any social media or contact links.

#### ViewContent (All Pages)

The `ViewContentTracker` component tracks page views across your entire application.

## Setting Up in App.tsx

To enable ViewContent tracking, add the ViewContentTracker component to your main App:

```tsx
import ViewContentTracker from './components/ViewContentTracker';

function App() {
  return (
    <>
      <ViewContentTracker />
      <Routes>
        {/* your routes */}
      </Routes>
    </>
  );
}
```

## Required Parameters for Each Event

### Complete Registration
- Event Time
- Event Name
- Event Source URL
- Action Source
- Client User Agent

### Contact
- Event Time
- Event Name
- Event Source URL
- Action Source
- Client User Agent

### View Content
- Event Time
- Event Name
- Event Source URL
- Action Source
- Client User Agent

## Testing Your Implementation

1. Use Facebook's Test Events tool to verify events are being received
2. Check for any errors in the browser console
3. Verify events are being sent with the correct parameters

## Security Considerations

- The access token is stored in an environment variable
- User data is hashed before being sent to Facebook (implementation needed in production)
- Only necessary data is collected and shared

## Additional Notes

- Update the Pixel ID in both the Meta Pixel code and the Meta service
- Ensure your access token has the correct permissions
- Consider implementing proper SHA-256 hashing for PII in production