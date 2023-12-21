# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.3.2] - 2023-12-21

### Fixed

- Crash highlighting strings with some characters like `*`, etc... (thanks @coclav)

## [0.3.1] - 2023-03-10

### Fixed

- More solid ignores using `data-highlighted=""` when update directive lifecycle reached

## [0.3.0] - 2023-03-09

### Added

- Way to ignore element's content from being highlighted adding this attribute to it: `data-highlighted=""`

### Fixed

- Replacing nodes with links (`<a ...></a>`) and other inline HTML elements

## [0.2.0] - 2023-03-09

### Fixed

- HTML-safe matching

## [0.1.0] - 2021-10-04

### Added

- First pre-release of the package