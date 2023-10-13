import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('gps')
export class gpsEntity {
  @PrimaryGeneratedColumn()
  public id: number;
  @Column('varchar')
  public name: string;
  @Column('varchar')
  public longitude: string;
  @Column('varchar')
  public latitude: string;
  @Column('varchar')
  public altitude: string;
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at: Date;
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updated_at: Date;
}
