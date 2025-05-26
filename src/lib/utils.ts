import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Department, PastPerformance, Project, Feedback, User } from '@/types';
import { departments } from '@/types';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomDepartment(): Department {
  const depts = departments as string[];
  return depts[getRandomInt(0, depts.length - 1)] as Department;
}

export function generateMockPastPerformance(count: number = 3): PastPerformance[] {
  const performance: PastPerformance[] = [];
  for (let i = 0; i < count; i++) {
    const year = 2022 + i;
    performance.push({
      id: `pp-${i}-${Date.now()}`,
      date: `${year}-${getRandomInt(1, 12)}-${getRandomInt(1, 28)}`,
      rating: getRandomInt(1, 5),
      comments: `Performance review for Q${getRandomInt(1, 4)} ${year}. Lorem ipsum dolor sit amet.`,
    });
  }
  return performance.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function generateMockProjects(count: number = 2): Project[] {
  const projects: Project[] = [];
  for (let i = 0; i < count; i++) {
    const startDate = new Date(2022 + i, getRandomInt(0, 11), getRandomInt(1, 28));
    const inProgress = Math.random() > 0.5;
    const endDate = !inProgress ? new Date(startDate.getFullYear(), startDate.getMonth() + getRandomInt(1, 6), getRandomInt(1, 28)) : undefined;

    projects.push({
      id: `proj-${i}-${Date.now()}`,
      name: `Project Alpha ${i + 1}`,
      status: inProgress && Math.random() > 0.2 ? "In Progress" : (inProgress ? "On Hold" : "Completed"),
      description: `This project aimed to deliver X and Y. Involving tasks A, B, C. Key learnings include Z.`,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate?.toISOString().split('T')[0],
    });
  }
  return projects;
}

export function generateMockFeedback(count: number = 2): Feedback[] {
  const types: Feedback["type"][] = ["Positive", "Constructive", "Neutral"];
  const feedbackItems: Feedback[] = [];
  for (let i = 0; i < count; i++) {
    feedbackItems.push({
      id: `fb-${i}-${Date.now()}`,
      date: `2023-${getRandomInt(1, 12)}-${getRandomInt(1, 28)}`,
      from: i % 2 === 0 ? "Manager" : "Peer Colleague",
      comment: `Feedback item ${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
      type: types[getRandomInt(0, types.length - 1)],
    });
  }
  return feedbackItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function generateRandomSkills(count: number = 5): string[] {
  const allSkills = ["JavaScript", "React", "Node.js", "Python", "Project Management", "Communication", "Teamwork", "Leadership", "Data Analysis", "Marketing Strategy", "Salesforce", "UX Design"];
  const selectedSkills = new Set<string>();
  while (selectedSkills.size < count && selectedSkills.size < allSkills.length) {
    selectedSkills.add(allSkills[getRandomInt(0, allSkills.length - 1)]);
  }
  return Array.from(selectedSkills);
}

type DummyUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  image: string;
  username: string;
  phone: string;
  company?: {
    department?: string;
    title?: string;
    name?: string;
  };
  address?: {
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
};

export function transformDummyUserToUser(dummyUser: DummyUser): User {
  const department = departments.includes(dummyUser.company?.department as Department)
    ? dummyUser.company?.department as Department
    : getRandomDepartment();

  return {
    id: dummyUser.id,
    firstName: dummyUser.firstName,
    lastName: dummyUser.lastName,
    email: dummyUser.email,
    age: dummyUser.age,
    image: dummyUser.image,
    username: dummyUser.username,
    company: {
      department: department,
      title: dummyUser.company?.title || 'N/A',
      name: dummyUser.company?.name || 'N/A',
    },
    address: {
      address: dummyUser.address?.address || 'N/A',
      city: dummyUser.address?.city || 'N/A',
      state: dummyUser.address?.state || 'N/A',
      postalCode: dummyUser.address?.postalCode || 'N/A',
      country: dummyUser.address?.country || 'N/A',
    },
    phone: dummyUser.phone,
    performanceRating: getRandomInt(1, 5),
    bio:
      dummyUser.company?.department && dummyUser.company?.title
        ? `An experienced ${dummyUser.company.title} in the ${dummyUser.company.department} department. Dedicated and results-oriented professional.`
        : `A valuable member of the team, bringing enthusiasm and a unique skill set.`,
    yearsOfExperience: getRandomInt(1, 15),
    skills: generateRandomSkills(getRandomInt(3, 6)),
    pastPerformance: generateMockPastPerformance(),
    projects: generateMockProjects(),
    feedback: generateMockFeedback(),
  };
}

export const getPerformanceBadgeColor = (rating: number): string => {
  if (rating >= 4) return "bg-green-500 hover:bg-green-600";
  if (rating >= 3) return "bg-yellow-500 hover:bg-yellow-600";
  if (rating >= 2) return "bg-orange-500 hover:bg-orange-600";
  return "bg-red-500 hover:bg-red-600";
};

export const getPerformanceText = (rating: number): string => {
  if (rating >= 4.5) return "Excellent";
  if (rating >= 4) return "Great";
  if (rating >= 3.5) return "Good";
  if (rating >= 3) return "Satisfactory";
  if (rating >= 2) return "Needs Improvement";
  return "Unsatisfactory";
};

export function getInitials(firstName?: string, lastName?: string): string {
  if (!firstName) return 'U';
  const firstInitial = firstName.charAt(0).toUpperCase();
  const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
  return `${firstInitial}${lastInitial}`;
}
