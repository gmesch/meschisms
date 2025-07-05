# A function that wraps command execution and makes it traceable.

trap 'echo "ERROR"' ERR

run() {
  declare -r comment="$1"
  shift

  echo "${comment} ..."
  echo "${*@Q}"
  "$@"
  echo "OK"
  echo
}
