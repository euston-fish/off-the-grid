cat << EOF
export const gameSource =
  Uint8Array.from(
    '$(cat $1 | od -A n -t x1 | tr -d ' ' | tr -d '\n')'
    .split('')
    .chunk(2)
    .map(([a, b]) => parseInt(a+b, 16))
  );
EOF
