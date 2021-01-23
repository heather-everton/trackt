import React from 'react';
import Auth from '../../utils/auth';
import image from '../../images/placeholder-profile-pic.png';

import CommentList from '../CommentList';
import PostHeader from '../PostHeader';

const GoalPost = ({ goal }) => {
    return (
        <div className="card goal-post-card shadow-sm">
            <div className="card-header">
                    <PostHeader goal={goal} />
            </div>
            <div className="card-body">
                <h4>{goal.goalTitle}</h4>
                <p>Category: {goal.goalCategory}</p>
                <p>Status: {goal.goalStatus}</p>
                <p>start Date: {goal.startDate} End Date: {goal.dueDate}</p>
                Description: 
                <p>{goal.goalDescription}</p>

                <button class="btn btn-link" type="button" data-toggle="collapse" data-target={"#" + goal._id + "_comments"} aria-expanded="false">
                    View {goal.comments.length} Comments
                </button>
                <div class="collapse" id={goal._id + "_comments"}>
                    <CommentList comments={goal.comments} />
                </div>
            </div>
        </div>
    );
};

export default GoalPost;