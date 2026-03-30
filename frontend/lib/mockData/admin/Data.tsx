export type DataRow = {
  Student_ID: number;
  RFID_ID: string;
  Student_Name: string;
  Student_Bottles: number;
  Student_Tokens: number;
  Student_weight: number;
};

export const mockData: DataRow[] = [
  {
    Student_ID: 16001,
    RFID_ID: "4225453543",
    Student_Name: "Punnarit Songlek",
    Student_Bottles: 4,
    Student_Tokens: 53,
    Student_weight: 12,
  },
];
