pub fn format_str(str: &str) -> String {
    return str.replace('\u{a0}', "");
}
