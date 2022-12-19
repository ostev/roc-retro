// This ia a modified version of https://github.com/roc-lang/roc/blob/main/examples/platform-switching/web-assembly-platform/host.zig

const std = @import("std");
const str = @import("str");
const builtin = @import("builtin");
const RocStr = str.RocStr;

const RocListU8 = extern struct { elements: [*]u8, length: usize, capacity: usize };
const RocListU32 = extern struct { elements: [*]u32, length: usize, capacity: usize };

const Align = extern struct { a: usize, b: usize };
extern fn malloc(size: usize) callconv(.C) ?*align(@alignOf(Align)) anyopaque;
extern fn realloc(c_ptr: [*]align(@alignOf(Align)) u8, size: usize) callconv(.C) ?*anyopaque;
extern fn free(c_ptr: [*]align(@alignOf(Align)) u8) callconv(.C) void;
extern fn memcpy(dest: *anyopaque, src: *anyopaque, count: usize) *anyopaque;

// Roc exports
extern fn roc__mainForHost_1_exposed_generic([*]u8) void;
extern fn roc__mainForHost_size() i64;
extern fn roc__mainForHost_1__Fx_caller(*const u8, [*]u8, [*]u8) void;
extern fn roc__mainForHost_1__Fx_size() i64;
extern fn roc__mainForHost_1__Fx_result_size() i64;

// JS exports
extern fn js_render(
    framebuffer: [*]u8,
    framebufferLength: usize,
    width: usize,
    height: usize,
    palette: [*]u32,
) void;

export fn roc_alloc(size: usize, alignment: u32) callconv(.C) ?*anyopaque {
    _ = alignment;

    return malloc(size);
}

export fn roc_realloc(c_ptr: *anyopaque, new_size: usize, old_size: usize, alignment: u32) callconv(.C) ?*anyopaque {
    _ = old_size;
    _ = alignment;

    return realloc(@alignCast(@alignOf(Align), @ptrCast([*]u8, c_ptr)), new_size);
}

export fn roc_dealloc(c_ptr: *anyopaque, alignment: u32) callconv(.C) void {
    _ = alignment;

    free(@alignCast(@alignOf(Align), @ptrCast([*]u8, c_ptr)));
}

export fn roc_memcpy(dest: *anyopaque, src: *anyopaque, count: usize) callconv(.C) void {
    _ = memcpy(dest, src, count);
}

pub export fn roc_fx_render(pixels: *RocListU8, width: usize, height: usize, palette: *RocListU32) callconv(.C) void {
    // js_render(pixels.elements, @intToFloat(f64, width), @intToFloat(f64, height));

    js_render(pixels.elements, pixels.length, width, height, palette.elements);
}

pub fn main() u8 {
    // var starting_memory = malloc(100 * 1000 * 1024);
    // defer free(@alignCast(@alignOf(Align), @ptrCast([*]u8, starting_memory)));

    // var callResult = RocListU8.empty();
    // var raw_numbers: [NUM_NUMS + 1]i64 = undefined;

    // set refcount to one
    // raw_numbers[0] = -9223372036854775808;

    // var numbers = raw_numbers[1..];

    // for (numbers) |_, i| {
    //     numbers[i] = @mod(@intCast(i64, i), 12);
    // }

    // var roc_list = RocListU8{ .elements = numbers, .length = NUM_NUMS, .capacity = NUM_NUMS };

    // js_render(output.elements, 256, 224);

    const allocator = std.heap.page_allocator;

    // NOTE that the roc__mainForHost_size() can be 0, which would cause a segfault.
    // To deal with this, we always allocate at least 8 bytes.
    const size = std.math.max(8, @intCast(usize, roc__mainForHost_size()));
    const raw_output = allocator.allocAdvanced(u8, @alignOf(u64), @intCast(usize, size), .at_least) catch unreachable;
    var output = @ptrCast([*]u8, raw_output);

    defer {
        allocator.free(raw_output);
    }

    roc__mainForHost_1_exposed_generic(output);

    call_roc_closure(output);

    return 0;
}

fn call_roc_closure(closure_data_pointer: [*]u8) void {
    const allocator = std.heap.page_allocator;

    const size = roc__mainForHost_1__Fx_result_size();

    if (size == 0) {
        // The closure returns an empty record
        // If we attempted to allocate 0 bytes, the program would crash
        // since the allocator will return a NULL pointer, so we implement
        // some custom logic in this case.

        const flags: u8 = 0;
        var result: [1]u8 = .{0};
        roc__mainForHost_1__Fx_caller(&flags, closure_data_pointer, &result);

        return;
    }

    const raw_output = allocator.allocAdvanced(u8, @alignOf(u64), @intCast(usize, size), .at_least) catch unreachable;
    var output = @ptrCast([*]u8, raw_output);

    defer {
        allocator.free(raw_output);
    }

    const flags: u8 = 0;
    roc__mainForHost_1__Fx_caller(&flags, closure_data_pointer, output);

    return;
}
