import { Field, ID, ObjectType } from "type-graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import Post from "./Post";

@ObjectType()
@Entity()
class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column({ unique: true })
  username: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  fullName?: string;

  @Field({nullable: true})
  @Column({nullable: true})
  profilePhotoURL: string;

  @Column()
  password: string;

  @Column({default: 0})
  tokenVersion: number;

  @Field(() => [Post])
  @OneToMany(() => Post, post => post.user)
  posts: Post[]

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}

export default User;
