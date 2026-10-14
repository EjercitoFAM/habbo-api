# `@ejercito-fam/habbo-api`

```ts
import { Habbo, HotelDomainURL } from '@ejercito-fam/habbo-api';

// Initialize the client:
const client = new Habbo({
	baseURL: HotelDomainURL.Spanish
});

// Fetch a user by its username:
const result = await client.users.getByUsername('-tobi-talent-');

// Log the user:
const user = result.unwrap();
console.log(user);
```

## Wired variables

Rooms expose their wired variables through keys configured in the room's wired settings. Values are signed 64-bit
integers, read as `bigint`.

```ts
// Bind the client to a room:
const room = client.wired.room(12345, { readKey: 'read-key', writeKey: 'write-key' });

// Read and write a user variable:
const score = room.userVariable('score');
await score.users.set(44, 10n);
const { value } = (await score.users.get(44)).unwrap();

// List the top 10 users by score:
const top = await score.users.getValues({ orderBy: 'value', orderDirection: 'desc', size: 10 });

// Furni take the ID as seen in the client, negative for wall items:
await room.furniVariable('open').update(-91, 1n);

// Read every variable an entity holds, then update several at once:
const profile = (await room.getUserProfile(44)).unwrap();
await profile.update({ score: (profile.get('score') ?? 0n) + 1n, streak: null });

// Run up to 50 operations in a single request:
const batch = await score
	.batch()
	.getUser(44)
	.updateUser(44, value + 5n)
	.deletePet(12)
	.execute();
```
