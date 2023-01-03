export default interface Rule {
  name: string;
  include: boolean;
  includeText: string;
  length: number;
  first: 1 | 2 | 3 | 4;
  firstText: string;
  characters: string;
  result?: string;
}
