import axios from 'axios';
import React, { useState } from 'react';
import StarRatings from 'react-rating-stars-component';
import { useParams } from 'react-router-dom';
import { API } from './config';

const FeedbackReview = () => {
    const { id } = useParams();
    const [rating, setRating] = useState(0);
    const [general_comments, setGeneralComments] = useState('');
    const [organization_feedback, setOrganizationFeedback] = useState('');
    const [experience_feedback, setExperienceFeedback] = useState('');
    const [suggestions, setSuggestions] = useState('');


    const handleSubmit = (event) => {
        event.preventDefault();

        const feedbackData = {

            rating,
            general_comments,
            organization_feedback,
            experience_feedback,
            suggestions
        };

        axios.post(`${API}/feedback/${id}/`, feedbackData)
            .then(response => {
                console.log(response);
                // handle success
            })
            .catch(error => {
                console.error(error);
                // handle error
            });
    }


    return (
        <div className="container">
            <div className="row">
                <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                    <div className="row g-3">
                        <form onSubmit={handleSubmit}>
                            <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                                <label>
                                    Rating:
                                    <StarRatings
                                        count={5}
                                        value={rating}
                                        name="rating"
                                        onChange={newRating => setRating(newRating)}
                                        size={24}
                                        activeColor="#ffd700"
                                    />
                                </label>
                            </div>
                            <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                                <div className="form-floating">
                                    <textarea
                                        className="form-control"
                                        id="floatingGeneralComments"
                                        placeholder="General Comments"
                                        name='general_comments'
                                        value={general_comments}
                                        onChange={e => setGeneralComments(e.target.value)}
                                    />
                                    <label htmlFor="floatingGeneralComments">General Comments</label>
                                </div>
                            </div>
                            <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                                <div className="form-floating">
                                    <textarea
                                        className="form-control"
                                        id="floatingOrganizationFeedback"
                                        placeholder="Organization Feedback"
                                        name="organization_feedback"
                                        value={organization_feedback}
                                        onChange={e => setOrganizationFeedback(e.target.value)}
                                    />
                                    <label htmlFor="floatingOrganizationFeedback">Organization Feedback</label>
                                </div>
                            </div>
                            <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                                <div className="form-floating">
                                    <textarea
                                        className="form-control"
                                        id="floatingExperienceFeedback"
                                        placeholder="Experience Feedback"
                                        name='experience_feedback'
                                        value={experience_feedback}
                                        onChange={e => setExperienceFeedback(e.target.value)}
                                    />
                                    <label htmlFor="floatingExperienceFeedback">Experience Feedback</label>
                                </div>
                            </div>
                            <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                                <div className="form-floating">
                                    <textarea
                                        className="form-control"
                                        id="floatingSuggestions"
                                        placeholder="Suggestions for Improvement"
                                        name='suggestions'
                                        value={suggestions}
                                        onChange={e => setSuggestions(e.target.value)}
                                    />
                                    <label htmlFor="floatingSuggestions">Suggestions for Improvement</label>
                                </div>
                            </div>
                            <button type="submit">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FeedbackReview