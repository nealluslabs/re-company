import { google } from 'googleapis';
import { Showing } from '../firebase/types';

export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
  location?: string;
}

/**
 * Fetch events from Google Calendar
 * This should be called from a Cloud Function or API route with proper authentication
 */
export const fetchShowingEvents = async (
  accessToken: string,
  timeMin?: Date,
  timeMax?: Date
): Promise<CalendarEvent[]> => {
  const calendar = google.calendar({ version: 'v3', auth: new google.auth.OAuth2() });
  calendar.setCredentials({ access_token: accessToken });

  const response = await calendar.events.list({
    calendarId: 'primary',
    timeMin: timeMin?.toISOString(),
    timeMax: timeMax?.toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
    q: 'SHOWING', // Filter events containing "SHOWING" in title
  });

  const events = response.data.items || [];

  return events
    .filter((event) => {
      // Additional filter: check if summary contains "SHOWING"
      const summary = event.summary || '';
      return summary.toUpperCase().includes('SHOWING');
    })
    .map((event) => ({
      id: event.id!,
      summary: event.summary || '',
      description: event.description || undefined,
      start: {
        dateTime: event.start?.dateTime || event.start?.date || '',
        timeZone: event.start?.timeZone || 'UTC',
      },
      end: {
        dateTime: event.end?.dateTime || event.end?.date || '',
        timeZone: event.end?.timeZone || 'UTC',
      },
      location: event.location || undefined,
    }));
};

/**
 * Convert Calendar Event to Showing format
 */
export const calendarEventToShowing = (
  event: CalendarEvent,
  agentId: string,
  listingId?: string,
  clientId?: string
): Omit<Showing, 'id' | 'createdAt' | 'updatedAt'> => {
  return {
    agentId,
    listingId,
    clientId,
    calendarEventId: event.id,
    title: event.summary,
    description: event.description,
    startTime: new Date(event.start.dateTime),
    endTime: new Date(event.end.dateTime),
    location: event.location || '',
    status: 'scheduled',
  };
};

