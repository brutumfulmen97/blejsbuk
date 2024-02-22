import { FC } from "react";

interface PostEditFormProps {
  post: {
    id: string;
    title: string;
    content: string;
    authorId: string;
    authorName: string;
    createdAt: Date;
  };
}

const PostEditForm: FC<PostEditFormProps> = ({ post }) => {
  return <div>PostEditForm</div>;
};

export default PostEditForm;
