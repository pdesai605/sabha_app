import type { Person } from "@/modules/people/types";
import { WARDS, BOOTHS, AREAS } from "@/modules/people/constants";

const FIRST_NAMES = [
  "Amit", "Sneha", "Ravi", "Kiran", "Pooja", "Sanjay", "Anjali", "Vijay",
  "Smita", "Nilesh", "Ritu", "Pradeep", "Manisha", "Ashok", "Divya", "Sunil",
  "Geeta", "Ramesh", "Usha", "Mahesh", "Lata", "Dinesh", "Kavita", "Anil",
  "Sunita", "Prakash", "Rekha", "Harish", "Varsha", "Gopal", "Radha", "Suresh",
  "Madhuri", "Ajinkya", "Tejas", "Shruti", "Abhijit", "Nikita", "Sachin",
  "Rohini", "Ganesh", "Swati", "Yogesh", "Nisha", "Balaji", "Chitra",
  "Deepak", "Archana", "Milind", "Supriya", "Tushar", "Jyoti", "Sameer",
  "Pallavi", "Vinod", "Sandhya", "Rahul", "Meena", "Chetan", "Aparna",
  "Bhushan", "Sonali", "Nitin", "Kalpana", "Santosh", "Vaishali", "Rajendra",
  "Shobha", "Mukesh", "Aarti",
];

const LAST_NAMES = [
  "Patil", "Deshmukh", "Kulkarni", "Jadhav", "Shinde", "Bhosale", "More",
  "Naik", "Pawar", "Gaikwad", "Chavan", "Salunkhe", "Thorat", "Kadam",
  "Raut", "Mane", "Joshi", "Bhandari", "Yadav", "Sharma", "Kamble",
  "Gokhale", "Nimbalkar", "Phadke", "Dhamale", "Lokhande", "Sawant",
  "Talekar", "Wagh", "Sonawane", "Kale", "Shetty", "Reddy", "Iyer",
  "Nair", "Gupta", "Singh", "Verma", "Mehta", "Shah", "Desai",
];

function pick<T>(arr: readonly T[], index: number): T {
  return arr[index % arr.length];
}

function mobileForIndex(i: number): string {
  return `9${String(100000000 + i * 123457).slice(0, 9)}`;
}

function initials(first: string, last: string): string {
  return `${first[0]}${last[0]}`.toUpperCase();
}

function dobForAgeGroup(index: number): string {
  const year = 1960 + (index % 45);
  const month = (index % 12) + 1;
  const day = (index % 28) + 1;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** Generates people p-031 through p-100 to support party member assignments */
export function generateExtendedPeople(): Person[] {
  const result: Person[] = [];

  for (let i = 31; i <= 100; i++) {
    const idx = i - 31;
    const firstName = pick(FIRST_NAMES, idx);
    const lastName = pick(LAST_NAMES, idx + 7);
    const ward = pick(WARDS, idx);
    const booth = pick(BOOTHS, idx + 3);
    const area = pick(AREAS, idx + 2);
    const mobile = mobileForIndex(i);
    const gender = idx % 3 === 0 ? "female" : idx % 3 === 1 ? "male" : "male";

    result.push({
      id: `p-${String(i).padStart(3, "0")}`,
      firstName,
      lastName,
      fullName: `${firstName} ${lastName.charAt(0)}. ${lastName}`,
      mobile,
      whatsapp: mobile,
      email: idx % 4 === 0 ? `${firstName.toLowerCase()}.${lastName.toLowerCase()}@gmail.com` : undefined,
      gender: gender as Person["gender"],
      dateOfBirth: dobForAgeGroup(idx),
      area,
      ward,
      booth,
      address: {
        line1: `${(idx % 99) + 1}, ${area} Road`,
        city: "Pune",
        district: "Pune",
        state: "Maharashtra",
        pincode: `411${String((idx % 50) + 1).padStart(3, "0")}`,
      },
      tags: idx % 5 === 0 ? ["Volunteer"] : idx % 7 === 0 ? ["Supporter"] : [],
      status: idx % 11 === 0 ? "inactive" : "active",
      lastActivity: `2026-0${(idx % 6) + 1}-${String((idx % 25) + 1).padStart(2, "0")}T10:00:00`,
      createdAt: `2025-${String((idx % 12) + 1).padStart(2, "0")}-15T09:00:00`,
      updatedAt: `2026-07-${String((idx % 20) + 1).padStart(2, "0")}T12:00:00`,
      initials: initials(firstName, lastName),
    });
  }

  return result;
}
