import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { AiOutlineUser, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import toast, { Toaster } from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";

const API_BASE = "http://127.0.0.1:8001/api";

interface Review {
  _id: string;
  user: { _id: string; name: string; avatar?: string };
  rating: number;
  body: string;
  createdAt: string;
}

const ProductReviewSection = () => {
  const { id: productId } = useParams<{ id: string }>();
  const { loggedInUser } = useAppContext();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [reviewText, setReviewText] = useState("");
  const [newRating, setNewRating] = useState(0);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editRating, setEditRating] = useState(0);

  const [expanded, setExpanded] = useState(false);
  const initialCount = 2;

  const token = localStorage.getItem("actualToken");

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/products/${productId}/review`);
      const data = await res.json();
      const list = data.reviews || data.data || data || [];
      setReviews(Array.isArray(list) ? list : []);
    } catch (err) {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const StarRating = ({
    rating,
    setRating,
    interactive = true,
    size = "text-2xl",
  }: {
    rating: number;
    setRating: (n: number) => void;
    interactive?: boolean;
    size?: string;
  }) => {
    const [hover, setHover] = useState(0);

    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && setRating(star)}
            onMouseEnter={() => interactive && setHover(star)}
            onMouseLeave={() => interactive && setHover(0)}
            className={`transition-all ${
              interactive ? "hover:scale-110 cursor-pointer" : "cursor-default"
            } ${size}`}
          >
            <span
              className={
                star <= (hover || rating)
                  ? "text-yellow-400 drop-shadow"
                  : "text-gray-300"
              }
            >
              ★
            </span>
          </button>
        ))}
      </div>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return toast.error("Please write a review");
    if (newRating === 0) return toast.error("Please select a rating");

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/products/${productId}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ body: reviewText.trim(), rating: newRating }),
      });

      if (res.ok) {
        toast.success("Review posted successfully!");
        setReviewText("");
        setNewRating(0);
        fetchReviews();
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to post review");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (review: Review) => {
    setEditingId(review._id);
    setEditText(review.body);
    setEditRating(review.rating);
  };

  const saveEdit = async (reviewId: string) => {
    if (!editText.trim()) return toast.error("Review cannot be empty");
    if (editRating === 0) return toast.error("Please select a rating");

    try {
      const res = await fetch(
        `${API_BASE}/products/${productId}/review/${reviewId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ body: editText.trim(), rating: editRating }),
        }
      );

      if (res.ok) {
        toast.success("Review updated!");
        setEditingId(null);
        fetchReviews();
      } else {
        toast.error("Update failed");
      }
    } catch {
      toast.error("Network error");
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (!confirm("Delete this review permanently?")) return;

    try {
      const res = await fetch(
        `${API_BASE}/products/${productId}/review/${reviewId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        toast.success("Review deleted");
        setReviews((prev) => prev.filter((r) => r._id !== reviewId));
      }
    } catch {
      toast.error("Failed to delete");
    }
  };

  const isOwnReview = (userId: string) => loggedInUser?._id === userId;

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
      : "0";

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    const percent = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
    return { star, count, percent };
  });

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500">Loading reviews...</div>
    );
  }

  return (
    <div className="w-full mt-16 bg-gray-300">
      <Toaster position="top-center" />

      {reviews.length > 0 && (
        <div className="bg-gray-50 rounded-2xl p-8 mb-12">
          <div className="grid md:grid-cols-3 gap-10 items-center">
            <div className="text-center">
              <div className="text-6xl font-bold text-gray-900">
                {averageRating}
              </div>
              <StarRating
                rating={Math.round(parseFloat(averageRating))}
                setRating={() => {}}
                interactive={false}
                size="text-4xl"
              />
              <p className="text-gray-600 mt-2">
                Based on {reviews.length} reviews
              </p>
            </div>

            <div className="md:col-span-2 space-y-3">
              {ratingDistribution.map(({ star, percent }) => (
                <div key={star} className="flex items-center gap-4">
                  <span className="text-sm font-medium w-10">{star}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-orange-500 h-3 rounded-full transition-all duration-700"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 w-12 text-right">
                    {Math.round(percent)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {loggedInUser ? (
        <div className=" border rounded-2xl p-8 mb-12 shadow-sm">
          <h3 className="text-xl font-bold mb-6">Write Your Review</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Rating <span className="text-red-500">*</span>
              </label>
              <StarRating
                rating={newRating}
                setRating={setNewRating}
                size="text-3xl"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Your Review <span className="text-red-500">*</span>
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience... What did you like or dislike?"
                rows={5}
                className="w-full px-5 py-4 border rounded-xl focus:ring-2 focus:ring-orange-500 resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting || newRating === 0 || !reviewText.trim()}
              className="px-8 py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-800 text-white font-semibold rounded-xl transition"
            >
              {submitting ? "Posting..." : "Submit Review"}
            </button>
          </form>
        </div>
      ) : (
        <div className="text-center py-12 bg-blue-50 rounded-2xl mb-12">
          <p className="text-lg">
            <a href="/auth/login" className="text-blue-600 font-bold underline">
              Log in
            </a>{" "}
            to write a review
          </p>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-8">
          Customer Reviews {reviews.length > 0 && `(${reviews.length})`}
        </h2>

        {reviews.length === 0 ? (
          <p className="text-center py-20 text-gray-500 text-lg">
            No reviews yet. Be the first!
          </p>
        ) : (
          <div className="space-y-8">
            {reviews
              .slice(0, expanded ? undefined : initialCount)
              .map((review) => (
                <div
                  key={review._id}
                  className="flex gap-6 pb-8 border-b last:border-b-0 animate-in fade-in slide-in-from-bottom-2 duration-500"
                >
                  <div className="shrink-0">
                    {review.user.avatar ? (
                      <img
                        src={review.user.avatar}
                        alt={review.user.name}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center">
                        <AiOutlineUser className="text-3xl text-gray-500" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-lg">
                          {review.user.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>

                      {isOwnReview(review.user._id) && (
                        <div className="flex gap-3 text-gray-600">
                          <button
                            onClick={() => startEdit(review)}
                            title="Edit"
                          >
                            <AiOutlineEdit className="text-xl hover:text-blue-600" />
                          </button>
                          <button
                            onClick={() => deleteReview(review._id)}
                            title="Delete"
                          >
                            <AiOutlineDelete className="text-xl hover:text-red-600" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 my-3">
                      <StarRating
                        rating={review.rating}
                        setRating={() => {}}
                        interactive={false}
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {review.rating}.0
                      </span>
                    </div>

                    {editingId === review._id ? (
                      <div className="mt-5 space-y-5 bg-gray-50 p-5 rounded-xl">
                        <div>
                          <label className="text-sm font-medium">
                            Update Rating
                          </label>
                          <StarRating
                            rating={editRating}
                            setRating={setEditRating}
                            size="text-3xl"
                          />
                        </div>
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          rows={4}
                          className="w-full px-4 py-3 border rounded-lg resize-none focus:ring-2 focus:ring-orange-500"
                        />
                        <div className="flex gap-3">
                          <button
                            onClick={() => saveEdit(review._id)}
                            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-6 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-700 leading-relaxed mt-2">
                        {review.body}
                      </p>
                    )}
                  </div>
                </div>
              ))}

            {reviews.length > initialCount && (
              <div className="text-center pt-8">
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-xl transition-all"
                >
                  {expanded ? (
                    <>Show Less ↑</>
                  ) : (
                    <>Show All {reviews.length-initialCount} Reviews ↓</>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductReviewSection;
