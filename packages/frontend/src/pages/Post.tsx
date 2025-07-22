import { useState, useEffect, useMemo } from "react";
import client from "../lib/directus";
import { readItem } from "@directus/sdk";
import { useParams, useLocation } from "react-router-dom";

function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

const Post = () => {
  const { id } = useParams();
  const query = useQuery();
  const [article, setArticle] = useState<any>(null);

  // Fetch the article using its id
  const fetchArticle = async () => {
    let result;

    try {
      result = await client.request(readItem("Posts", id!));
    } catch (error) {
      if ((error as any).response.status === 403) {
        console.error(
          "Either this post is private or you do not have access to it",
        );
      } else console.error("Error fetching article:", error);
      result = {
        title: "Post not found",
        content: "We couldn't find this post",
      };
    }
    setArticle(result);
  };

  useEffect(() => {
    fetchArticle();
  }, [id]);

  if (!article) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Add this line */}
      {query.get("preview") ? <p>This a preview of the post</p> : <p />}

      <h1>{article.title}</h1>
      <p>{article.content}</p>
    </div>
  );
};

export default Post;
