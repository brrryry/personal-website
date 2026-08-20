use std::fs::{self, File};
use std::io::{self, Read, Write};
use std::path::{Path};
use serde::{Serialize, Deserialize};
use serde_json::Value as JsonValue;
use pulldown_cmark::{Parser, Options, html};
use tera::{Tera, Context};
use walkdir::WalkDir;
use regex::Regex;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct FrontMatter {
    pub title: String,
    pub date: String,
    pub description: String,
    pub tags: Vec<String>,
    pub status: Option<String>,
    pub draft: Option<bool>,
    pub updated: Option<String>,
    pub seriestag: Option<String>,
}

#[derive(Debug, Serialize, Clone)]
pub struct BlogPost {
    pub id: String,
    pub title: String,
    pub date: String,
    pub description: String,
    pub tags: Vec<String>,
    pub status: String,
    pub updated: Option<String>,
    pub seriestag: Option<String>,
    pub html_content: String,
}

#[derive(Serialize)]
struct Skills {
    programming: Vec<&'static str>,
    databases: Vec<&'static str>,
    tools: Vec<&'static str>,
    frameworks: Vec<&'static str>,
    certifications: Vec<&'static str>,
}

pub fn build_site() -> Result<(), Box<dyn std::error::Error>> {
    println!("Starting static site compilation...");

    // 1. Initialize Tera template engine
    let mut tera = Tera::new("templates/**/*")?;
    // Disable autoescape so HTML content works natively
    tera.autoescape_on(vec![]);

    // 2. Ensure dist directories exist
    fs::create_dir_all("dist/static")?;
    fs::create_dir_all("dist/blog")?;
    fs::create_dir_all("dist/projects")?;

    // 3. Load content JSONs
    let projects_raw = fs::read_to_string("data/projects.json")?;
    let projects_json: JsonValue = serde_json::from_str(&projects_raw)?;
    
    let experience_raw = fs::read_to_string("data/experience.json")?;
    let experience_json: JsonValue = serde_json::from_str(&experience_raw)?;

    let education_raw = fs::read_to_string("data/education.json")?;
    let education_json: JsonValue = serde_json::from_str(&education_raw)?;

    // 4. Parse Blog Posts
    let mut posts = Vec::new();
    let posts_dir = Path::new("posts");
    
    let re_latex = Regex::new(r#"<LatexWrapper\s+content="([^"]+)"(?:\s+width="[^"]+")?\s*/?>"#)?;

    for entry in WalkDir::new(posts_dir) {
        let entry = entry?;
        let path = entry.path();
        if path.is_file() && (path.extension().map_or(false, |e| e == "mdx" || e == "md")) {
            let mut file = File::open(path)?;
            let mut content = String::new();
            file.read_to_string(&mut content)?;

            // Parse FrontMatter and Markdown body
            if let Some((fm, body)) = parse_post_content(&content) {
                // If it is a draft, skip in production (we will compile all posts for simplicity, or check env)
                if fm.draft.unwrap_or(false) {
                    // Skip or keep (let's keep for development, but check if we want drafts)
                }

                let id = path.file_stem().unwrap().to_string_lossy().into_owned();
                
                // Unindent HTML tags to prevent markdown parser from treating them as indented code blocks
                let mut processed_body = unindent_html_blocks(body);
                
                // Process LatexWrapper -> render with KaTeX server-side
                processed_body = re_latex.replace_all(&processed_body, |caps: &regex::Captures| {
                    let content = &caps[1];
                    let opts = katex::Opts::builder().display_mode(true).build().unwrap();
                    match katex::render_with_opts(content, &opts) {
                        Ok(rendered) => format!(r#"<div class="flex justify-center text-center my-4 overflow-x-auto">{}</div>"#, rendered),
                        Err(_) => format!(r#"<div class="flex justify-center text-center my-4 overflow-x-auto">$${}$$</div>"#, content),
                    }
                }).into_owned();

                // Process BlogCode manually to convert to standard code blocks
                processed_body = replace_blog_codes(&processed_body);

                // Process BlogImage manually to capture multiple optional parameters
                processed_body = replace_blog_images(&processed_body);

                // Convert Markdown headers to HTML header tags to avoid HTML block conflicts
                processed_body = replace_markdown_headers(&processed_body);

                // Convert citation markdown links to native HTML anchors
                processed_body = replace_citations(&processed_body);

                // Convert Markdown bold blocks to native HTML strong tags to support HTML-embedded bolds
                processed_body = replace_bolds(&processed_body);

                // Format citation listings at the end of the post to ensure they have line breaks
                processed_body = format_citations_list(&processed_body);

                // Preprocess all math blocks to prevent markdown parser from corrupting math symbols
                processed_body = preprocess_math(&processed_body);

                // Compile Markdown to HTML
                let mut options = Options::empty();
                options.insert(Options::ENABLE_TABLES);
                options.insert(Options::ENABLE_STRIKETHROUGH);
                options.insert(Options::ENABLE_TASKLISTS);
                options.insert(Options::ENABLE_HEADING_ATTRIBUTES);
                let parser = Parser::new_ext(&processed_body, options);
                let mut html_content = String::new();
                html::push_html(&mut html_content, parser);

                let status = fm.status.clone().unwrap_or_else(|| {
                    if fm.draft.unwrap_or(false) {
                        "in progress".to_string()
                    } else {
                        "finished".to_string()
                    }
                });

                posts.push(BlogPost {
                    id,
                    title: fm.title,
                    date: fm.date,
                    description: fm.description,
                    tags: fm.tags,
                    status,
                    updated: fm.updated,
                    seriestag: fm.seriestag,
                    html_content,
                });
            }
        }
    }

    // Sort posts by date descending
    posts.sort_by(|a, b| {
        b.date.cmp(&a.date)
    });

    // 5. Gather unique tags for the blog switcher (filtering out "series")
    let mut tags = Vec::new();
    for p in &posts {
        for t in &p.tags {
            if !tags.contains(t) && !t.to_lowercase().contains("series") {
                tags.push(t.clone());
            }
        }
    }
    tags.sort();

    // 6. RENDER PAGES
    let commit_hash = crate::COMMIT_HASH;
    let commit_hash_short = if commit_hash.len() >= 8 { &commit_hash[..8] } else { commit_hash };

    // 6.1 index.html (Home Page)
    let active_projects = filter_active_projects(&projects_json);
    let recent_posts: Vec<BlogPost> = posts.iter().take(4).cloned().collect();

    let mut index_ctx = Context::new();
    index_ctx.insert("active_projects", &active_projects);
    index_ctx.insert("recent_posts", &recent_posts);
    index_ctx.insert("commit_hash", &commit_hash);
    index_ctx.insert("commit_hash_short", &commit_hash_short);
    let index_rendered = tera.render("index.html", &index_ctx)?;
    write_output_file("dist/index.html", &index_rendered)?;

    // 6.2 about.html (About Page)
    let skills = Skills {
        programming: vec!["Python", "R", "Javascript", "Bash", "Java", "Git", "C", "C++"],
        databases: vec!["PostgreSQL", "MySQL / MariaDB", "MongoDB", "Firebase", "SQLite"],
        tools: vec!["Linux", "Docker", "RStudio", "Jupyter", "Git", "MS Azure"],
        frameworks: vec!["TensorFlow", "PyTorch", "Scikit-learn", "Pandas", "Seaborn", "NextJS", "Flask"],
        certifications: vec!["Microsoft Azure: Data Science Associate (DP-100)"],
    };

    let mut about_ctx = Context::new();
    about_ctx.insert("education", &education_json);
    about_ctx.insert("experience", &experience_json);
    about_ctx.insert("projects", &projects_json);
    about_ctx.insert("skills", &skills);
    about_ctx.insert("commit_hash", &commit_hash);
    about_ctx.insert("commit_hash_short", &commit_hash_short);
    let about_rendered = tera.render("about.html", &about_ctx)?;
    write_output_file("dist/about.html", &about_rendered)?;

    // 6.3 blog.html (Blog Catalog Page)
    let mut blog_ctx = Context::new();
    blog_ctx.insert("posts", &posts);
    blog_ctx.insert("tags", &tags);
    blog_ctx.insert("commit_hash", &commit_hash);
    blog_ctx.insert("commit_hash_short", &commit_hash_short);
    let blog_rendered = tera.render("blog.html", &blog_ctx)?;
    write_output_file("dist/blog.html", &blog_rendered)?;

    // 6.4 blog/[id].html (Single Post Pages)
    for post in &posts {
        let mut post_ctx = Context::new();
        post_ctx.insert("post", post);
        post_ctx.insert("commit_hash", &commit_hash);
        post_ctx.insert("commit_hash_short", &commit_hash_short);
        let post_rendered = tera.render("post.html", &post_ctx)?;
        let post_path = format!("dist/blog/{}.html", post.id);
        write_output_file(&post_path, &post_rendered)?;
    }

    // 6.5 projects/cat-or-car.html (TFJS Project)
    let mut cat_or_car_ctx = Context::new();
    cat_or_car_ctx.insert("commit_hash", &commit_hash);
    cat_or_car_ctx.insert("commit_hash_short", &commit_hash_short);
    let cat_or_car_rendered = tera.render("cat-or-car.html", &cat_or_car_ctx)?;
    write_output_file("dist/projects/cat-or-car.html", &cat_or_car_rendered)?;

    // 7. Copy static assets recursively
    copy_dir_all("static", "dist/static")?;

    // Copy static contents directly to dist root for direct access (e.g. /me.jpg, /blogs/...)
    for entry in fs::read_dir("static")? {
        let entry = entry?;
        let name = entry.file_name();
        let src_path = entry.path();
        let dst_path = std::path::PathBuf::from("dist").join(&name);
        if src_path.is_dir() {
            copy_dir_all(&src_path, &dst_path)?;
        } else {
            fs::copy(&src_path, &dst_path)?;
        }
    }

    println!("Compilation completed successfully! Assets output to dist/");
    Ok(())
}

// Helpers

fn parse_post_content(content: &str) -> Option<(FrontMatter, &str)> {
    if !content.starts_with("---") {
        return None;
    }
    
    // Find second "---"
    let remainder = &content[3..];
    if let Some(end_idx) = remainder.find("---") {
        let yaml_str = &remainder[..end_idx];
        let body = &remainder[end_idx + 3..];
        
        match serde_yaml::from_str::<FrontMatter>(yaml_str) {
            Ok(fm) => Some((fm, body)),
            Err(e) => {
                eprintln!("Failed to parse YAML frontmatter: {}", e);
                None
            }
        }
    } else {
        None
    }
}

fn filter_active_projects(projects: &JsonValue) -> Vec<JsonValue> {
    let mut active = Vec::new();
    if let Some(arr) = projects.as_array() {
        for p in arr {
            let status = p.get("status").and_then(|s| s.as_str()).unwrap_or("");
            if status != "complete" && status != "deprecated" {
                active.push(p.clone());
            }
        }
    }
    active
}

fn write_output_file(path: &str, content: &str) -> io::Result<()> {
    let mut file = File::create(path)?;
    file.write_all(content.as_bytes())?;
    Ok(())
}

fn copy_dir_all(src: impl AsRef<Path>, dst: impl AsRef<Path>) -> io::Result<()> {
    fs::create_dir_all(&dst)?;
    for entry in fs::read_dir(src)? {
        let entry = entry?;
        let ty = entry.file_type()?;
        if ty.is_dir() {
            copy_dir_all(entry.path(), dst.as_ref().join(entry.file_name()))?;
        } else {
            fs::copy(entry.path(), dst.as_ref().join(entry.file_name()))?;
        }
    }
    Ok(())
}

// Parse attributes in <BlogImage ... /> custom tag and replace with standard figure layout
fn replace_blog_images(content: &str) -> String {
    let re_blog_image = Regex::new(r#"<BlogImage\s+([^>]+)/>"#).unwrap();
    
    re_blog_image.replace_all(content, |caps: &regex::Captures| {
        let attrs_str = &caps[1];
        
        // Simple key-value parser for attributes
        let mut src = String::new();
        let mut caption = String::new();
        let mut source = String::new();
        let mut alt = String::new();
        let mut width = String::new();
        
        let re_attr = Regex::new(r#"(\w+)\s*=\s*"([^"]*)""#).unwrap();
        for attr_cap in re_attr.captures_iter(attrs_str) {
            let key = &attr_cap[1];
            let val = &attr_cap[2];
            match key {
                "src" => src = val.to_string(),
                "caption" => caption = val.to_string(),
                "source" => source = val.to_string(),
                "alt" => alt = val.to_string(),
                "width" => width = val.to_string(),
                _ => {}
            }
        }
        
        if alt.is_empty() {
            alt = "Image with no alt :(".to_string();
        }
        
        let img_width_style = if !width.is_empty() {
            format!(r#"width="{width}""#, width = width)
        } else {
            r#"width="auto""#.to_string()
        };
        
        let source_html = if !source.is_empty() {
            format!(r#" (<a href="{source}" target="_blank">source</a>)"#, source = source)
        } else {
            String::new()
        };
        
        format!(
            r#"<br />
<figure class="items-center text-center">
  <div class="flex justify-center mx-3">
    <img src="{src}" {img_width_style} alt="{alt}">
  </div>
  <p>{caption}{source_html}</p>
</figure>
<br />"#,
            src = src,
            img_width_style = img_width_style,
            alt = alt,
            caption = caption,
            source_html = source_html
        )
    }).into_owned()
}

// Parse attributes in <BlogCode ...> ... </BlogCode> tag and replace with standard markdown fenced code block
fn replace_blog_codes(content: &str) -> String {
    let re_blog_code = Regex::new(r#"(?s)<BlogCode\b([^>]*)>\s*(?:\{\s*`\s*)?(.*?)(?:\s*`\s*\})?\s*</BlogCode>"#).unwrap();
    
    re_blog_code.replace_all(content, |caps: &regex::Captures| {
        let attrs_str = &caps[1];
        let code = &caps[2];
        
        let mut language = String::new();
        let mut caption = String::new();
        
        let re_attr = Regex::new(r#"(\w+)\s*=\s*"([^"]*)""#).unwrap();
        for attr_cap in re_attr.captures_iter(attrs_str) {
            let key = &attr_cap[1];
            let val = &attr_cap[2];
            match key {
                "language" => language = val.to_string(),
                "caption" | "title" => caption = val.to_string(),
                _ => {}
            }
        }
        
        let mut replacement = String::new();
        if !caption.is_empty() {
            replacement.push_str(&format!(
                r#"<div class="code-block-header">{}</div>"#,
                caption
            ));
            replacement.push_str("\n\n");
        }
        
        replacement.push_str(&format!("```{}\n", language));
        replacement.push_str(code);
        replacement.push_str("\n```");
        
        replacement
    }).into_owned()
}

fn preprocess_math(content: &str) -> String {
    let chars: Vec<char> = content.chars().collect();
    let len = chars.len();
    let mut result = String::new();
    let mut i = 0;

    while i < len {
        // Display math: $$ ... $$
        if i + 1 < len && chars[i] == '$' && chars[i + 1] == '$' {
            // Find the closing $$
            let start = i + 2;
            let mut j = start;
            while j + 1 < len && !(chars[j] == '$' && chars[j + 1] == '$') {
                j += 1;
            }
            if j + 1 < len {
                let inner: String = chars[start..j].iter().collect();
                let clean_inner = inner.lines()
                    .filter(|line| !line.trim().is_empty())
                    .collect::<Vec<&str>>()
                    .join("\n");
                
                let opts = katex::Opts::builder().display_mode(true).build().unwrap();
                match katex::render_with_opts(&clean_inner, &opts) {
                    Ok(rendered) => {
                        result.push_str("\n\n<div class=\"math-block\">");
                        result.push_str(&rendered);
                        result.push_str("</div>\n\n");
                    }
                    Err(_) => {
                        result.push_str("\n\n<div class=\"math-block\">$$");
                        result.push_str(&clean_inner);
                        result.push_str("$$</div>\n\n");
                    }
                }
                i = j + 2;
            } else {
                result.push_str("$$");
                i += 2;
            }
        }
        // Inline math: $ ... $ (closing must be on the same line, no nested $)
        else if chars[i] == '$' {
            let start = i + 1;
            // Scan ahead for closing $ on the same line
            let mut j = start;
            let mut found = false;
            while j < len && chars[j] != '\n' {
                if chars[j] == '$' {
                    found = true;
                    break;
                }
                j += 1;
            }
            if found && j > start {
                let inner: String = chars[start..j].iter().collect();
                let opts = katex::Opts::builder().display_mode(false).build().unwrap();
                match katex::render_with_opts(&inner, &opts) {
                    Ok(rendered) => {
                        result.push_str(&rendered);
                    }
                    Err(_) => {
                        result.push('$');
                        result.push_str(&inner);
                        result.push('$');
                    }
                }
                i = j + 1;
            } else {
                result.push('$');
                i += 1;
            }
        } else {
            result.push(chars[i]);
            i += 1;
        }
    }

    result
}

// Convert Markdown headers (# Header, ## Header, etc.) outside code blocks to HTML tags (<h1>Header</h1>, etc.)
// to ensure proper rendering regardless of proximity to other HTML block elements.
fn replace_markdown_headers(content: &str) -> String {
    let mut result = String::new();
    let mut in_code_block = false;

    for line in content.lines() {
        let trimmed = line.trim();
        if trimmed.starts_with("```") {
            in_code_block = !in_code_block;
            result.push_str(line);
            result.push('\n');
            continue;
        }

        if !in_code_block {
            let mut hash_count = 0;
            for c in line.chars() {
                if c == '#' {
                    hash_count += 1;
                } else {
                    break;
                }
            }

            let next_char = line.chars().nth(hash_count);
            if hash_count > 0 && hash_count <= 6 && (next_char == Some(' ') || next_char == Some('\t')) {
                let header_text = line[hash_count..].trim();
                let html_header = format!("<h{level}>{text}</h{level}>", level = hash_count, text = header_text);
                result.push_str(&html_header);
                result.push('\n');
                continue;
            }
        }

        result.push_str(line);
        result.push('\n');
    }

    result
}

// Convert markdown citation links (e.g. [\\[3\\]](#citation3)) to HTML tags so they parse correctly inside HTML block structures.
fn replace_citations(content: &str) -> String {
    let re_citation = Regex::new(r#"\[\\*\[?(\d+)\\*\]?\]\(#citation(\d+)\)"#).unwrap();
    re_citation.replace_all(content, |caps: &regex::Captures| {
        let num = &caps[1];
        let id = &caps[2];
        format!("<a href=\"#citation{}\">[{}]</a>", id, num)
    }).into_owned()
}

// Convert Markdown bold (**text**) outside code blocks to HTML tags (<strong>text</strong>)
// to ensure proper rendering inside HTML blocks (like list items <li>).
fn replace_bolds(content: &str) -> String {
    let mut result = String::new();
    let mut in_code_block = false;
    let re_bold = Regex::new(r#"\*\*([^*]+)\*\*"#).unwrap();

    for line in content.lines() {
        let trimmed = line.trim();
        if trimmed.starts_with("```") {
            in_code_block = !in_code_block;
            result.push_str(line);
            result.push('\n');
            continue;
        }

        if !in_code_block {
            let replaced = re_bold.replace_all(line, |caps: &regex::Captures| {
                let inner = &caps[1];
                format!("<strong>{}</strong>", inner)
            });
            result.push_str(&replaced);
        } else {
            result.push_str(line);
        }
        result.push('\n');
    }

    result
}

// Strip leading spaces from HTML tags outside code blocks to prevent markdown compiler
// from rendering them as indented code blocks.
fn unindent_html_blocks(content: &str) -> String {
    let mut result = String::new();
    let mut in_code_block = false;
    let re_html_tag = Regex::new(r#"^\s+(</?(?:div|ul|li|p|span|a|br|hr|table|tr|td|th|ol|h[1-6]|BlogList|BlogCode|BlogImage|LatexWrapper)\b.*)"#).unwrap();

    for line in content.lines() {
        let trimmed = line.trim();
        if trimmed.starts_with("```") {
            in_code_block = !in_code_block;
            result.push_str(line);
            result.push('\n');
            continue;
        }

        if !in_code_block {
            if let Some(caps) = re_html_tag.captures(line) {
                result.push_str(&caps[1]);
            } else {
                result.push_str(line);
            }
        } else {
            result.push_str(line);
        }
        result.push('\n');
    }

    result
}

// Add <br /> to citations lists at the bottom of posts if they are on consecutive lines.
fn format_citations_list(content: &str) -> String {
    let mut result = String::new();
    let mut in_code_block = false;

    for line in content.lines() {
        let trimmed = line.trim();
        if trimmed.starts_with("```") {
            in_code_block = !in_code_block;
            result.push_str(line);
            result.push('\n');
            continue;
        }

        if !in_code_block && trimmed.starts_with("<span id=\"citation") {
            if !trimmed.ends_with("<br />") && !trimmed.ends_with("</p>") {
                result.push_str(line);
                result.push_str(" <br />");
            } else {
                result.push_str(line);
            }
        } else {
            result.push_str(line);
        }
        result.push('\n');
    }

    result
}

