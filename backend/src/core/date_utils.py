from datetime import datetime, timedelta, timezone
from typing import Optional, Any
import re

# Pakistan Standard Time (PKT) is UTC+5
PKT_TZ = timezone(timedelta(hours=5))

def get_pkt_now() -> datetime:
    """Returns current datetime in PKT (UTC+5)."""
    return datetime.now(PKT_TZ)

def get_current_time_context() -> str:
    """Formatted reference string for LLM system prompt."""
    now = get_pkt_now()
    return now.strftime("%A, %B %d, %Y, %I:%M %p PKT (UTC+5)")

def parse_due_date(value: Optional[Any], reference_now: Optional[datetime] = None) -> Optional[datetime]:
    """
    Safely parses an ISO date string, date-only string, or common relative date expression
    into a timezone-naive datetime object suitable for database storage.
    """
    if not value:
        return None

    if isinstance(value, datetime):
        return value.replace(tzinfo=None) if value.tzinfo else value

    if not isinstance(value, str):
        return None

    val = value.strip().lower()
    if not val or val in ("none", "null"):
        return None

    now = reference_now if reference_now else get_pkt_now()
    # Use naive version of now for calculations
    now_naive = now.replace(tzinfo=None)

    # 1. Try standard ISO format parsing
    try:
        # Handle 'Z' suffix
        cleaned = value.strip().replace("Z", "+00:00")
        dt = datetime.fromisoformat(cleaned)
        return dt.replace(tzinfo=None)
    except (ValueError, TypeError):
        pass

    # 2. Try common explicit formats
    explicit_formats = [
        "%Y-%m-%d %H:%M:%S",
        "%Y-%m-%d %H:%M",
        "%Y-%m-%d",
        "%d-%m-%Y",
        "%m/%d/%Y",
        "%Y/%m/%d",
    ]
    for fmt in explicit_formats:
        try:
            dt = datetime.strptime(value.strip(), fmt)
            if fmt in ("%Y-%m-%d", "%d-%m-%Y", "%m/%d/%Y", "%Y/%m/%d"):
                # Default date-only due date to end of business day (18:00)
                dt = dt.replace(hour=18, minute=0, second=0)
            return dt
        except ValueError:
            continue

    # 3. Handle relative natural language expressions
    if val in ("today", "tonight"):
        target_hour = 21 if val == "tonight" else 18
        return now_naive.replace(hour=target_hour, minute=0, second=0, microsecond=0)

    if val == "tomorrow":
        target = now_naive + timedelta(days=1)
        return target.replace(hour=18, minute=0, second=0, microsecond=0)

    if val == "this weekend":
        # Calculate upcoming Saturday
        days_ahead = (5 - now_naive.weekday()) % 7
        if days_ahead == 0:
            days_ahead = 7
        target = now_naive + timedelta(days=days_ahead)
        return target.replace(hour=12, minute=0, second=0, microsecond=0)

    if val == "next week":
        target = now_naive + timedelta(days=7)
        return target.replace(hour=9, minute=0, second=0, microsecond=0)

    # "in X days" or "X days"
    m_days = re.search(r"(\d+)\s+day", val)
    if m_days:
        days = int(m_days.group(1))
        target = now_naive + timedelta(days=days)
        return target.replace(hour=18, minute=0, second=0, microsecond=0)

    # "in X hours" or "X hours"
    m_hours = re.search(r"(\d+)\s+hour", val)
    if m_hours:
        hours = int(m_hours.group(1))
        return now_naive + timedelta(hours=hours)

    # "Monday", "next Monday", "Friday", etc.
    weekdays = {
        "monday": 0,
        "tuesday": 1,
        "wednesday": 2,
        "thursday": 3,
        "friday": 4,
        "saturday": 5,
        "sunday": 6,
    }
    for day_name, day_num in weekdays.items():
        if day_name in val:
            days_ahead = (day_num - now_naive.weekday()) % 7
            if days_ahead == 0:
                days_ahead = 7
            target = now_naive + timedelta(days=days_ahead)
            return target.replace(hour=18, minute=0, second=0, microsecond=0)

    return None
