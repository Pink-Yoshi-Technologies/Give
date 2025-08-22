import React from "react";
import PropTypes from 'prop-types';
import UserCard from "./UserCard";
import PostData from "./PostData";
import PollBox from "./PollBox";

const Post = ({user, group, post}) => {

  return (
    <div className="w-full rounded-3xl p-4 bg-backgroundGrey flex flex-col items-center">
      <UserCard user={user} group={group} timeLeft={post.timeLeft} />
      <PostData post={post} />
      {/* <PollBox initialOptions={pollOptions} /> */}
    </div>
  )
}


Post.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    profilePic: PropTypes.string,
  }).isRequired,
  group: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  post: PropTypes.shape({
    question: PropTypes.string,
    content: PropTypes.array,
    timeLeft: PropTypes.string,
  }).isRequired,
  // pollOptions: PropTypes.array.isRequired,
};

export default Post;
