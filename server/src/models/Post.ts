import { Field, ID, ObjectType } from "type-graphql";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, RelationId, UpdateDateColumn } from "typeorm";
import User from "./User";

@ObjectType()
@Entity()
class Post {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  caption: string;

  @Field()
  @Column()
  photoURL: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.posts, {onDelete: "CASCADE"})
  user: User;

  @RelationId((post: Post) => post.user)
  userId: string;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;
}

export default Post