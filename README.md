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
