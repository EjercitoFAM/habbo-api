export enum HotelDomainTLD {
	Brazilian = '.com.br',
	Danish = '.dk',
	Dutch = '.nl',
	Finnish = '.fi',
	French = '.fr',
	German = '.de',
	International = '.com',
	Italian = '.it',
	Spanish = '.es',
	Turkish = '.com.tr'
}

export const HotelDomainURL = {
	Brazilian: `https://www.habbo${HotelDomainTLD.Brazilian}`,
	Danish: `https://www.habbo${HotelDomainTLD.Danish}`,
	Dutch: `https://www.habbo${HotelDomainTLD.Dutch}`,
	Finnish: `https://www.habbo${HotelDomainTLD.Finnish}`,
	French: `https://www.habbo${HotelDomainTLD.French}`,
	German: `https://www.habbo${HotelDomainTLD.German}`,
	International: `https://www.habbo${HotelDomainTLD.International}`,
	Italian: `https://www.habbo${HotelDomainTLD.Italian}`,
	Spanish: `https://www.habbo${HotelDomainTLD.Spanish}`,
	Turkish: `https://www.habbo${HotelDomainTLD.Turkish}`
} as const;
