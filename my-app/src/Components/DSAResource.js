// Resources.js
import { useState, useEffect } from "react";
import { Container, Box, Typography, TextField, Button, Card, CardContent, Grid, Link, CircularProgress, Divider, List, ListItem, ListItemText, Paper } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PageHeader from "./PageHeader";

const DSAResources = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/search-dsa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: searchQuery,
          sites: ["leetcode.com", "geeksforgeeks.org", "naukri.com", "codeforces.com"]
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }

      const data = await response.json();
      setSearchResults(data.results);
    } catch (err) {
      setError(err.message);
      console.error("Search error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // DSA topics and resources
  const dsaTopics = [
    {
      title: "Arrays & Strings",
      resources: [
        { name: "Two Pointer Technique", link: "https://leetcode.com/articles/two-pointer-technique/" },
        { name: "Sliding Window", link: "https://leetcode.com/problems/sliding-window-maximum/" },
        { name: "Kadane's Algorithm", link: "https://www.geeksforgeeks.org/largest-sum-contiguous-subarray/" }
      ]
    },
    {
      title: "Linked Lists",
      resources: [
        { name: "Floyd's Cycle Detection", link: "https://www.geeksforgeeks.org/detect-loop-in-a-linked-list/" },
        { name: "Merge Two Sorted Lists", link: "https://leetcode.com/problems/merge-two-sorted-lists/" }
      ]
    },
    {
      title: "Trees & Graphs",
      resources: [
        { name: "Tree Traversals", link: "https://www.geeksforgeeks.org/tree-traversals-inorder-preorder-and-postorder/" },
        { name: "BFS vs DFS", link: "https://www.geeksforgeeks.org/difference-between-bfs-and-dfs/" },
        { name: "Dijkstra's Algorithm", link: "https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-greedy-algo-7/" }
      ]
    },
    {
      title: "Dynamic Programming",
      resources: [
        { name: "Introduction to DP", link: "https://www.geeksforgeeks.org/dynamic-programming/" },
        { name: "0/1 Knapsack", link: "https://www.geeksforgeeks.org/0-1-knapsack-problem-dp-10/" },
        { name: "Longest Common Subsequence", link: "https://leetcode.com/problems/longest-common-subsequence/" }
      ]
    }
  ];

  // Interview preparation resources
  const interviewResources = [
    { name: "Blind 75 LeetCode Questions", link: "https://leetcode.com/discuss/general-discussion/460599/blind-75-leetcode-questions" },
    { name: "Cracking the Coding Interview Book", link: "https://www.amazon.com/Cracking-Coding-Interview-Programming-Questions/dp/0984782850" },
    { name: "System Design Primer", link: "https://github.com/donnemartin/system-design-primer" },
    { name: "Tech Interview Handbook", link: "https://techinterviewhandbook.org/" }
  ];

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <PageHeader title="DSA Resources" />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Data Structures & Algorithms Resources
        </Typography>

        <Grid container spacing={3}>
          {/* Left side - Static DSA resources */}
          <Grid item xs={12} md={8}>
            <Typography variant="h5" gutterBottom>
              Essential DSA Topics
            </Typography>

            {dsaTopics.map((topic, index) => (
              <Card key={index} sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {topic.title}
                  </Typography>
                  <List dense>
                    {topic.resources.map((resource, idx) => (
                      <ListItem key={idx} disablePadding>
                        <ListItemText 
                          primary={
                            <Link href={resource.link} target="_blank" rel="noopener" color="primary">
                              {resource.name}
                            </Link>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            ))}

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              Interview Preparation
            </Typography>

            <Card>
              <CardContent>
                <List dense>
                  {interviewResources.map((resource, idx) => (
                    <ListItem key={idx} disablePadding>
                      <ListItemText 
                        primary={
                          <Link href={resource.link} target="_blank" rel="noopener" color="primary">
                            {resource.name}
                          </Link>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Right side - Search pane */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Search DSA Problems
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Search for DSA problems across LeetCode, GeeksForGeeks, CodeForces, and more.
              </Typography>
              
              <Box sx={{ display: "flex", mb: 3 }}>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  placeholder="e.g., binary search tree implementation"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <Button 
                  variant="contained" 
                  startIcon={<SearchIcon />}
                  onClick={handleSearch}
                  sx={{ ml: 1 }}
                  disabled={isLoading}
                >
                  {isLoading ? <CircularProgress size={24} color="inherit" /> : "Search"}
                </Button>
              </Box>

              {error && (
                <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                  Error: {error}
                </Typography>
              )}

              <Divider sx={{ my: 2 }} />

              {/* Search results section */}
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  {searchResults.length > 0 ? "Search Results" : "Results will appear here"}
                </Typography>

                {isLoading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <List dense>
                    {searchResults.map((result, index) => (
                      <ListItem key={index} disablePadding sx={{ mb: 1 }}>
                        <ListItemText
                          primary={
                            <Link href={result.url} target="_blank" rel="noopener">
                              {result.title}
                            </Link>
                          }
                          secondary={
                            <>
                              <Typography variant="body2" color="text.secondary">
                                {result.source}
                              </Typography>
                              <Typography variant="body2">{result.snippet}</Typography>
                            </>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default DSAResources;