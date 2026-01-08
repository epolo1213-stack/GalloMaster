
export enum BirdStatus {
  ACTIVE = 'Activo',
  IN_TRAINING = 'En Entrenamiento',
  BREEDING = 'En Cría',
  MOLTING = 'En Pelecha',
  SICK = 'Enfermo',
  RETIRED = 'Retirado',
  SOLD = 'Vendido',
  DECEASED = 'Muerto'
}

export enum Gender {
  MALE = 'Macho',
  FEMALE = 'Hembra'
}

export type IncubationMethod = 'Natural' | 'Incubadora';

export interface MedicalRecord {
  id: string;
  date: string;
  type: 'Vacuna' | 'Tratamiento' | 'Desparasitación' | 'Otro';
  description: string;
  nextDose?: string;
}

export interface Bird {
  id: string;
  plate: string;
  name: string;
  gender: Gender;
  breed: string;
  birthDate: string;
  weight: number;
  status: BirdStatus;
  fatherId?: string;
  motherId?: string;
  image: string;
  medicalHistory: MedicalRecord[];
  notes: string;
  // Campos de récord de combate
  wins: number;
  losses: number;
}

export interface BreedingPair {
  id: string;
  startDate: string;
  maleId: string;
  femaleId: string;
  eggsLaid: number;
  hatchedCount: number;
  status: 'Activa' | 'Finalizada';
  isIncubating: boolean;
  incubationMethod?: IncubationMethod;
  incubationStartDate?: string;
  expectedHatchDate?: string;
  eggsIncubating?: number;
}

export interface TrainingLog {
  id: string;
  birdId: string;
  date: string;
  activity: string;
  duration: number;
  intensity: 'Baja' | 'Media' | 'Alta';
  result?: 'Victoria' | 'Derrota' | 'Tabla';
}
