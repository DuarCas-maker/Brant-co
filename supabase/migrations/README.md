# Migration order

Supabase records the numeric prefix of each migration as its version. Applied
migrations must not be renamed, because a new prefix can make the CLI treat the
same schema change as a different migration.

The current logical sequence is:

| Order | Supabase version | Purpose |
| --- | --- | --- |
| 001 | `202609170001_initial_discovery.sql` | Initial lead, message and security schema |
| 002 | `202609210001_multiple_choice_assessment.sql` | Versioned questionnaire answers |
| 003 | `202609260001_contextual_assessment.sql` | Contextual answers and guided-assessment summary |

For future migrations, keep the Supabase timestamp prefix and place the next
logical number in the name, for example:

`YYYYMMDDHHMMSS_004_short_description.sql`

This keeps the requested 001, 002, 003 sequence visible without breaking the
migration history already stored by Supabase.
