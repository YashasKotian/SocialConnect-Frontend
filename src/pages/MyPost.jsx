import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ViewPost = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const response = await fetch(`/api/posts/${postId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch post");
        }
        const data = await response.json();
        setPost(data);
        
        // Fetch comments for this post
        const commentsResponse = await fetch(`/api/posts/${postId}/comments`);
        if (commentsResponse.ok) {
          const commentsData = await commentsResponse.json();
          setComments(commentsData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  if (!post) return <div className="text-center py-10">Post not found</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Post Content */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
        <p className="text-gray-500 text-sm mb-4">
          {new Date(post.createdAt).toLocaleDateString()}
        </p>
        <div className="prose mb-4">
          {post.content}
        </div>
        {post.image && (
          <img 
            src={post.image} 
            alt="Post" 
            className="w-full rounded-lg mb-4"
          />
        )}
      </div>

      {/* Comments Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Comments ({comments.length})</h2>
        
        {comments.length === 0 ? (
          <p className="text-gray-500">No comments yet. Be the first to comment!</p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment._id} className="border-l-4 border-blue-500 pl-4">
                <p className="font-semibold">{comment.author}</p>
                <p className="text-gray-600">{comment.text}</p>
                <p className="text-gray-400 text-sm">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewPost;
